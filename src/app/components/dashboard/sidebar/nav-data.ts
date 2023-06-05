import { INavbarData } from "./helper";

export const navbarData : INavbarData[] = [

    {
        routeLink: 'home',
        icon: 'fal fa-home',
        label: 'Dashboard',
    },
    {
        routeLink: 'invoice',
        icon: 'fas fa-file-invoice-dollar',
        label: 'Facturar',
        items: [
            {
                routeLink: 'invoice/createNewInvoice',
                //icon: 'fas fa-laptop',
                label: 'Facturar venta',
            },
            {
                routeLink: 'invoice/allInvoices',
                //icon: 'fas fa-laptop',
                label: 'Ver Facturas',
            },
        ]
    },
    {
        routeLink: 'products',
        icon: 'fas fa-laptop',
        label: 'Productos',
    },
    {
        routeLink: 'manageCategories',
        icon: 'fas fa-bookmark',
        label: 'Gestionar Categorias',
    },
    {
        routeLink: 'equipment',
        icon: 'fas fa-toolbox',
        label: 'Equipamiento',
    },
    {
        routeLink: 'settings',
        icon: 'fas fa-cogs',
        label: 'Ajustes',
    },
];