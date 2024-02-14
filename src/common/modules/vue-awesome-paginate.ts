import VueAwesomePaginate from "vue-awesome-paginate";
import type { UserModule } from '~/types'

export const install: UserModule = ({ app }) => {
  app.use(VueAwesomePaginate)
}
