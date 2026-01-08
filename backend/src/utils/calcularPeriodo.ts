export type PeriodoFiltro =
  | "ultimos_3_meses"
  | "ultimos_2_meses"
  | "ultimo_mes"
  | "ultima_semana";

export function calcularPeriodo(periodo?: string) {
  if (!periodo) return undefined;

  const agora = new Date();

  if (periodo === "ultimos_3_meses") {
    const inicio = new Date();
    inicio.setMonth(agora.getMonth() - 3);
    return { gte: inicio };
  }

  if (periodo === "ultimos_2_meses") {
    const inicio = new Date();
    inicio.setMonth(agora.getMonth() - 2);
    return { gte: inicio };
  }

  if (periodo === "ultimo_mes") {
    const inicio = new Date();
    inicio.setMonth(agora.getMonth() - 1);
    return { gte: inicio };
  }

  if (periodo === "ultima_semana") {
    const inicio = new Date();
    inicio.setDate(agora.getDate() - 7);
    return { gte: inicio };
  }

  return undefined;
}
