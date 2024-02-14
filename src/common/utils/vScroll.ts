export function scrollEle(idEle: any) {
  return document.querySelector(idEle)?.scrollIntoView()
}
export function scrollEle2(idEle: any) {
  return document.querySelector(idEle)?.scrollIntoView({block:"end"})
}
