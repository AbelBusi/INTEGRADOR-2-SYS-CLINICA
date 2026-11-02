import { PERMISOS } from '../../core/constants/permisos.constants';

export interface SubNavItem {
  label: string;
  route: string;
  roles?: string[];
  permisos?: string[];
}

export interface NavItem {
  label: string;
  icon: string;
  roles?: string[];
  permisos?: string[];
  sub?: SubNavItem[];
  route?: string;
  grupo?: string;
}

export const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/dashboard/inicio': { title: 'Inicio', subtitle: 'Resumen del consultorio' },
  '/dashboard/horario': {
    title: 'Horarios Médicos',
    subtitle: 'Planificación de turnos y disponibilidad',
  },
  '/dashboard/horariosXD': {
    title: 'Gestión de Horarios',
    subtitle: 'Horarios de trabajo de doctores y recepcionistas',
  },
  '/dashboard/citasXD': { title: 'Citas médicas', subtitle: 'Agenda y consultas programadas' },
  '/dashboard/citas/nuevo': { title: 'Nueva cita', subtitle: 'Registrar cita médica' },
  '/dashboard/citas/por-doctor': {
    title: 'Citas por doctor',
    subtitle: 'Panel de consultas asignadas al médico',
  },
  '/dashboard/pacientes': { title: 'Pacientes', subtitle: 'Historial y datos de pacientes' },
  '/dashboard/pacientes/nuevo': { title: 'Nuevo paciente', subtitle: 'Registro de paciente' },
  '/dashboard/doctores': { title: 'Doctores', subtitle: 'Equipo médico del consultorio' },
  '/dashboard/doctores/nuevo': { title: 'Nuevo doctor', subtitle: 'Alta de especialista' },
  '/dashboard/especialidades': { title: 'Especialidades', subtitle: 'Áreas médicas disponibles' },
  '/dashboard/roles': { title: 'Roles', subtitle: 'Roles disponibles' },
  '/dashboard/usuarios': { title: 'Usuarios', subtitle: 'Usuarios disponibles' },
  '/dashboard/horarios': { title: 'Horarios', subtitle: 'Horarios disponibles' },
  '/dashboard/empleados': { title: 'Empleados', subtitle: 'Empleados disponibles' },
  '/dashboard/pacientes-misCitas': { title: 'Mis citas', subtitle: 'Citas disponibles' },
  '/dashboard/medicos-misCitas': { title: 'Mis citas', subtitle: 'Citas disponibles' },
  '/dashboard/citas': { title: 'Citas', subtitle: 'Citas disponibles' },
  '/dashboard/medicos': { title: 'Medicos', subtitle: 'Medicos disponibles' },
  '/dashboard/cargos': { title: 'Cargos', subtitle: 'Áreas de cargos' },
  '/dashboard/recepcionistas': { title: 'Recepcionistas', subtitle: 'Personal de recepción' },
  '/dashboard/recepcionistas/nuevo': {
    title: 'Nuevo recepcionista',
    subtitle: 'Alta de recepcionista',
  },
  '/dashboard/usuariosXD': { title: 'Usuarios', subtitle: 'Cuentas del sistema' },
  '/dashboard/usuarios/nuevo': { title: 'Nuevo usuario', subtitle: 'Crear cuenta de acceso' },
  '/dashboard/rolesXD': { title: 'Roles', subtitle: 'Perfiles de acceso del sistema' },
  '/dashboard/mis-citas': { title: 'Mis Citas', subtitle: 'Consulta y atiende tus citas' },
  '/dashboard/mis-pacientes': {
    title: 'Mis Pacientes',
    subtitle: 'Pacientes relacionados con tu actividad',
  },
  '/dashboard/mis-citas-paciente': {
    title: 'Mis Citas',
    subtitle: 'Consulta el estado de tus citas médicas',
  },
  '/dashboard/mi-historia': {
    title: 'Mi Historia Clínica',
    subtitle: 'Tu historial de atenciones médicas',
  },
};

export const MENU_BASE: NavItem[] = [
  {
    label: 'Inicio',
    icon: 'dashboard',
    sub: [
      { label: 'Resumen', route: '/dashboard/inicio' },
      { label: 'Mi horario', route: '/dashboard/horario', roles: ['XD'] },
      { label: 'Gestión de horarios', route: '/dashboard/horarios', roles: ['ADMINISTRADORXD'] },
    ],
  },
  {
    label: 'Mi Consultorio',
    icon: 'medical_services',
    roles: ['DOCTORXD'],
    sub: [
      { label: 'Mis citas', route: '/dashboard/mis-citas', roles: ['DOCTOR'] },
      { label: 'Mis pacientes', route: '/dashboard/mis-pacientes', roles: ['DOCTOR'] },
    ],
  },
  {
    grupo: 'PERSONAL Y PACIENTES',
    label: 'Pacientes',
    icon: 'groups',
    permisos: ['PACIENTE_VER'],
    sub: [{ label: 'Ver pacientes', route: '/dashboard/pacientes', permisos: ['PACIENTE_VER'] }],
  },
  {
    grupo: 'PERSONAL Y PACIENTES',
    label: 'Empleados',
    icon: 'groups',
    permisos: ['EMPLEADO_VER'],
    sub: [{ label: 'Ver Empleados', route: '/dashboard/empleados', permisos: ['EMPLEADO_VER'] }],
  },
  {
    grupo: 'PERSONAL Y PACIENTES',
    label: 'Medicos',
    icon: 'groups',
    permisos: ['MEDICO_VER'],
    sub: [{ label: 'Ver Medicos', route: '/dashboard/medicos', permisos: ['MEDICO_VER'] }],
  },
  {
    label: 'Doctores',
    roles: ['ADMINISTRADORXD'],
    icon: 'medical_services',
    sub: [
      { label: 'Ver doctores', route: '/dashboard/doctores', roles: ['ADMINISTRADOR'] },
      { label: 'Agregar doctor', route: '/dashboard/doctores/nuevo', roles: ['ADMINISTRADOR'] },
    ],
  },
  {
    grupo: 'ATENCION MEDICA',
    label: 'Especialidades',
    permisos: ['ESPECIALIDAD_VER'],
    icon: 'local_hospital',
    sub: [
      {
        label: 'Ver especialidades',
        route: '/dashboard/especialidades',
        permisos: ['ESPECIALIDAD_VER'],
      },
    ],
  },
  {
    grupo: 'ATENCION MEDICA',
    label: 'Citas Medicas',
    permisos: ['CITA_VER'],
    icon: 'groups',
    sub: [{ label: 'Ver Citas Medicas', route: '/dashboard/citas' }],
  },
  {
    grupo: 'ADMINISTRACION',
    label: 'Cargos',
    icon: 'local_hospital',
    permisos: ['CARGO_VER'],
    sub: [{ label: 'Ver Cargos', route: '/dashboard/cargos', permisos: ['CARGO_VER'] }],
  },
  {
    grupo: 'ATENCION MEDICA',
    label: 'Mis citas',
    roles: ['PACIENTE'],
    permisos: ['CITA_PACIENTE_VER'],
    icon: 'local_hospital',
    sub: [{ label: 'Mis citas', route: '/dashboard/pacientes-misCitas' }],
  },
  {
    grupo: 'ATENCION MEDICA',
    label: 'Mis Citas Asignadas',
    roles: ['MEDICO'],
    icon: 'local_hospital',
    sub: [{ label: 'Mis citas', route: '/dashboard/medicos-misCitas' }],
  },
  {
    grupo: 'ADMINISTRACION',
    label: 'Roles',
    permisos: ['ROL_VER'],
    icon: 'local_hospital',
    sub: [
      {
        label: 'Ver Roles',
        route: '/dashboard/roles',
        permisos: ['ROL_VER'],
      },
    ],
  },
  {
    grupo: 'ADMINISTRACION',
    label: 'Horarios',
    icon: 'local_hospital',
    permisos: ['HORARIO_VER'],
    sub: [{ label: 'Ver Horarios', route: '/dashboard/horarios', permisos: ['HORARIO_VER'] }],
  },
  {
    grupo: 'ADMINISTRACION',
    label: 'Usuarios',
    icon: 'local_hospital',
    permisos: ['USUARIO_VER'],
    sub: [{ label: 'Ver Usuarios', route: '/dashboard/usuarios', permisos: ['USUARIO_VER'] }],
  },
  {
    label: 'Recepcionistas',
    roles: ['ADMINISTRADORXD'],
    icon: 'support_agent',
    sub: [
      { label: 'Ver recepcionistas', route: '/dashboard/recepcionistas', roles: ['ADMINISTRADOR'] },
      {
        label: 'Nuevo recepcionista',
        route: '/dashboard/recepcionistas/nuevo',
        roles: ['ADMINISTRADOR'],
      },
    ],
  },
  {
    label: 'Usuarios',
    roles: ['ADMINISTRADORXD'],
    icon: 'manage_accounts',
    sub: [
      { label: 'Ver usuarios', route: '/dashboard/usuarios', roles: ['ADMINISTRADOR'] },
      { label: 'Nuevo usuario', route: '/dashboard/usuarios/nuevo', roles: ['ADMINISTRADOR'] },
      { label: 'Roles', route: '/dashboard/roles', roles: ['ADMINISTRADOR'] },
    ],
  },
];
