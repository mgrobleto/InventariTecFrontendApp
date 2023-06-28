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
                label: 'Facturar nueva venta',
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
        routeLink: 'equipment',
        icon: 'fas fa-toolbox',
        label: 'Equipamiento',
    },
    {
        routeLink: 'customers',
        icon: 'fas fa-user-tag',
        label: 'Gestión de Clientes',
    },
    {
        routeLink: 'manageCategories',
        icon: 'fas fa-bookmark',
        label: 'Gestionar Categorias',
        items: [
            {
                routeLink: 'manageCategories/products',
                //icon: 'fas fa-laptop',
                label: 'Productos',
            },
            {
                routeLink: 'manageCategories/equipment',
                //icon: 'fas fa-laptop',
                label: 'Equipos de mantenimiento',
            },
            {
                routeLink: 'manageCategories/customers',
                //icon: 'fas fa-laptop',
                label: 'Tipos de Clientes',
            },
        ]
    },
    {
        routeLink: 'settings',
        icon: 'fas fa-cogs',
        label: 'Ajustes',
    },
    {
        routeLink: 'logout',
        icon: 'fas fa-sign-out-alt',
        label: 'Cerrar sesión',
    },
];