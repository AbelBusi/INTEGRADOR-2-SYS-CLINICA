export interface SubNavItem {
  label: string;
  route: string;
  roles?: string[];
}

export interface NavItem {
  label: string;
  icon: string;
  roles?: string[];
  sub?: SubNavItem[];
  route?: string;
  grupo?: string;
}

export const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/dashboard/inicio': { title: 'Inicio', subtitle: 'Resumen del consultorio' },
  '/dashboard/horario': { title: 'Horarios Médicos', subtitle: 'Planificación de turnos y disponibilidad' },
  '/dashboard/horarios': { title: 'Gestión de Horarios', subtitle: 'Horarios de trabajo de doctores y recepcionistas' },
  '/dashboard/citas': { title: 'Citas médicas', subtitle: 'Agenda y consultas programadas' },
  '/dashboard/citas/nuevo': { title: 'Nueva cita', subtitle: 'Registrar cita médica' },
  '/dashboard/citas/por-doctor': { title: 'Citas por doctor', subtitle: 'Panel de consultas asignadas al médico' },
  '/dashboard/pacientes': { title: 'Pacientes', subtitle: 'Historial y datos de pacientes' },
  '/dashboard/pacientes/nuevo': { title: 'Nuevo paciente', subtitle: 'Registro de paciente' },
  '/dashboard/doctores': { title: 'Doctores', subtitle: 'Equipo médico del consultorio' },
  '/dashboard/doctores/nuevo': { title: 'Nuevo doctor', subtitle: 'Alta de especialista' },
  '/dashboard/especialidades': { title: 'Especialidades', subtitle: 'Áreas médicas disponibles' },
  '/dashboard/recepcionistas': { title: 'Recepcionistas', subtitle: 'Personal de recepción' },
  '/dashboard/recepcionistas/nuevo': { title: 'Nuevo recepcionista', subtitle: 'Alta de recepcionista' },
  '/dashboard/usuarios': { title: 'Usuarios', subtitle: 'Cuentas del sistema' },
  '/dashboard/usuarios/nuevo': { title: 'Nuevo usuario', subtitle: 'Crear cuenta de acceso' },
  '/dashboard/roles': { title: 'Roles', subtitle: 'Perfiles de acceso del sistema' },
  '/dashboard/mis-citas': { title: 'Mis Citas', subtitle: 'Consulta y atiende tus citas' },
  '/dashboard/mis-pacientes': { title: 'Mis Pacientes', subtitle: 'Pacientes relacionados con tu actividad' },
  '/dashboard/mis-citas-paciente': { title: 'Mis Citas', subtitle: 'Consulta el estado de tus citas médicas' },
  '/dashboard/mi-historia': { title: 'Mi Historia Clínica', subtitle: 'Tu historial de atenciones médicas' },
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
    label: 'Citas',
    icon: 'calendar_today',
    roles: ['ADMINISTRADORXD', 'RECEPCIONISTA'],
    sub: [
      { label: 'Ver citas', route: '/dashboard/citas', roles: ['ADMINISTRADOR'] },
      { label: 'Agendar cita', route: '/dashboard/citas/nuevo', roles: ['ADMINISTRADOR', 'RECEPCIONISTA'] },
      { label: 'Historial de citas', route: '/dashboard/historial-citas', roles: ['RECEPCIONISTA'] },
      { label: 'Citas por doctor', route: '/dashboard/citas/por-doctor', roles: ['ADMINISTRADOR'] },
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
    label: 'Mi Salud',
    icon: 'health_and_safety',
    roles: ['PACIENTE'],
    sub: [
      { label: 'Mis citas', route: '/dashboard/mis-citas-paciente', roles: ['PACIENTE'] },
      { label: 'Mi historia clínica', route: '/dashboard/mi-historia', roles: ['PACIENTE'] },
    ],
  },
  {
    label: 'Pacientes',
    roles: ['ADMINISTRADOR', 'RECEPCIONISTA'],
    icon: 'groups',
    sub: [
      { label: 'Ver pacientes', route: '/dashboard/pacientes', roles: ['ADMINISTRADOR'] },
      { label: 'Nuevo paciente', route: '/dashboard/pacientes/nuevo', roles: ['ADMINISTRADOR', 'RECEPCIONISTA'] },
    ],
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
    roles: ['ADMINISTRADOR'],
    icon: 'local_hospital',
    sub: [
      { label: 'Ver especialidades', route: '/dashboard/especialidades', roles: ['ADMINISTRADOR'] },
    ],
  },
  {
    label: 'Recepcionistas',
    roles: ['ADMINISTRADORXD'],
    icon: 'support_agent',
    sub: [
      { label: 'Ver recepcionistas', route: '/dashboard/recepcionistas', roles: ['ADMINISTRADOR'] },
      { label: 'Nuevo recepcionista', route: '/dashboard/recepcionistas/nuevo', roles: ['ADMINISTRADOR'] },
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
