import {
  TipoEspacio as TipoEspacioEnum,
  ModalidadCobro as ModalidadCobroEnum,
} from "@/types/enums";

import type { EspacioDTO } from "@/types/espacios";

export function mapEspacioToCalculo(espacio: EspacioDTO) {
  return {
    tipo: espacio.tipo as TipoEspacioEnum,
    modalidadCobro: espacio.modalidadCobro as ModalidadCobroEnum,

    precioBaseSocio: espacio.precioBaseSocio,
    precioBaseExterno: espacio.precioBaseExterno,

    // sync + prisma
    precioPersonaAdicionalSocio: espacio.precioPersonaAdicionalSocio,
    precioPersonaAdicionalExterno: espacio.precioPersonaAdicionalExterno,

    precioPiscinaSocio: espacio.precioPiscinaSocio,
    precioPiscinaExterno: espacio.precioPiscinaExterno,
  };
}
