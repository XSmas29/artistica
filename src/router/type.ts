import { RouteRecordRaw ,RouteLocationRaw} from 'vue-router'
type breadcrumb = {
    title: string,
    disabled: boolean,
    to: RouteLocationRaw,
}

type myRouteMeta = {
    pageTitle: string,
    public: boolean,
    breadcrumbs: breadcrumb[],
    user?: boolean,
}

type MyRouteRecord = Omit<RouteRecordRaw, 'children' | 'meta'> & { meta?: myRouteMeta, children?: MyRouteRecord[] };

export {
	MyRouteRecord
}