export type RouteDefinition = {
  name: string;
  path: string;
  description?: string;
};

export const routes: RouteDefinition[] = [
  {
    name: "Dashboard",
    path: "/web/interface",
    description: "Ringkasan status robot dan aktivitas lapangan.",
  },
];

export const dashboardRoute = routes[0];

export function getRouteByPath(path: string) {
  return routes.find((route) => route.path === path);
}

