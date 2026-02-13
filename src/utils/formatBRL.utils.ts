export const formatBRL = (val: number): string => 
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);
