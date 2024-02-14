<script setup lang="ts">
import * as GMaps from '@googlemaps/js-api-loader';
import { storeToRefs } from 'pinia';
import { useBookingStore } from '../stores/booking';

const { Loader } = GMaps;

const bookingStore = useBookingStore();
const { boardingPlace, returnPlace, stationList, selectedStation } = storeToRefs(bookingStore);

const loader = new Loader({ apiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY, libraries: ['places'] });

const mapDiv = ref(null);
const map = ref<google.maps.Map>();
const markers = ref<google.maps.Marker[]>([]);

const currentPosition = ref({ latitude: null, longitude: null });

const confirmText = computed(() => {
	if (bookingStore.boardingPlace) {
		return 'このステーションを返却地に使う';
	}

	return 'このステーションを乗車地に使う';
});

const onClose = () => {
	bookingStore.updateSelectedStation(null);
};

const onComfirmLocation = () => {
	if (bookingStore.boardingPlace) {
		bookingStore.setReturnPlace(selectedStation.value);
	} else {
		bookingStore.setBoardingPlace(selectedStation.value);
	}

	onClose();
};

const createMap = () => {
	// @ts-ignore:next-line
	map.value = new google.maps.Map(mapDiv.value, {
		mapTypeControl: false,
		streetViewControl: false,
		center: {
			lat: currentPosition.value.latitude ? +currentPosition.value.latitude : 35.7090627,
			lng: currentPosition.value.longitude ? +currentPosition.value.longitude : 139.4093892,
		},
		zoom: 15,
	});

	const input = document.getElementById('mapInput') as HTMLInputElement;
	const searchBox = new google.maps.places.SearchBox(input);

	// Bias the SearchBox results towards current map's viewport.
	map.value.addListener('bounds_changed', () => {
		if (!map.value) {
			return;
		}
		searchBox.setBounds(map.value.getBounds() as google.maps.LatLngBounds);
	});

	searchBox.addListener('places_changed', async () => {
		if (!map.value) {
			return;
		}
		const places = searchBox.getPlaces();

		if (!places || places.length == 0) {
			return;
		}

		// For each place, get the icon, name and location.
		const bounds = new google.maps.LatLngBounds();
		const geo = places[0].geometry;
		if (geo && geo.location) {
			setPosition({
				latitude: geo.location.lat(),
				longitude: geo.location.lng(),
			});
		} else {
			bookingStore.searchStations();
		}

		places.forEach((place) => {
			if (!place.geometry || !place.geometry.location) {
				return;
			}

			if (place.geometry.viewport) {
				// Only geocodes have viewport.
				bounds.union(place.geometry.viewport);
			} else {
				bounds.extend(place.geometry.location);
			}
		});
		map.value.fitBounds(bounds);
	});
};

const hideMarkers = () => {
	markers.value.forEach((marker) => {
		console.log('🚀 ~ file: Map.vue:104 ~ hideMarkers ~ markers', marker);
		marker.setMap(null);
		marker.setVisible(false);
	});
	markers.value = [];
};
const setLocation = () => {
	let newCenter = null
	if (currentPosition.value?.latitude && currentPosition.value?.longitude)
	{
		newCenter ={lat: parseFloat(currentPosition.value?.latitude), lng: parseFloat(currentPosition.value?.longitude)};
		map.value?.setCenter(newCenter);
		map.value?.setZoom(15)
	}
}
const renderStationList = () => {
	hideMarkers();
	setLocation();
	const result: google.maps.Marker[] = [];

	for (const station of stationList.value) {
		if (boardingPlace.value && boardingPlace.value.franchise_id !== station.franchise_id) {
			continue;
		}

		const iconUrl =
			(station.id === boardingPlace.value?.id && boardingPlace.value?.pick_up_type === 1) ||
			(station.id === returnPlace.value?.id && returnPlace.value?.pick_up_type === 1)
				? '/images/Location_white.png'
				: station.id === boardingPlace.value?.id || station.id === returnPlace.value?.id
				? '/images/marker_clicked.svg'
				: station?.pick_up_type === 1
				? '/images/Location_blue.png'
				: '/images/marker.svg';

		const icon = {
			url: iconUrl, // url
			scaledSize: new google.maps.Size(40, 40), // scaled size
			origin: new google.maps.Point(0, 0), // origin
			anchor: new google.maps.Point(0, 0), // anchor
		};

		const marker = new google.maps.Marker({
			position: {
				lat: +station.latitude,
				lng: +station.longitude,
			},
			map: map.value,
			title: station.name_jp,
			icon,
		});

		marker.addListener('click', () => {
			bookingStore.updateSelectedStation(station);
		});

		result.push(marker);
	}

	markers.value = result;
};

async function setPosition(position: any) {
	currentPosition.value = position;
	bookingStore.searchStations(position);
}

watch(stationList, renderStationList);

watch(boardingPlace, renderStationList);

watch(returnPlace, renderStationList);

async function setDefaultPosition() {
	const stationList = await bookingStore.searchStations();
	setPosition({
		latitude: stationList[0].latitude,
		longitude: stationList[0].longitude,
	});
}

onMounted(async () => {
	await loader.load();
	createMap();

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			(position) =>
				setPosition({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
				}),
			setDefaultPosition,
		);
	} else {
		setDefaultPosition();
	}
});

const isOpen = computed(() => !!selectedStation.value);
</script>
<template>
	<div ref="mapDiv" style="width: 100%; height: 100%"></div>
	<ConfirmLocation
		:modal-active="isOpen"
		:confirm-text="confirmText"
		@onClose="onClose"
		@onConfirm="onComfirmLocation"
	/>
</template>
