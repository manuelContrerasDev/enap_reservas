import {
  TipoEspacio as TipoEspacioEnum,
  ModalidadCobro as ModalidadCobroEnum,
} from "@/shared/types/enums";

import type { EspacioDTO } from "@/modules/espacios/types/espacios";

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
