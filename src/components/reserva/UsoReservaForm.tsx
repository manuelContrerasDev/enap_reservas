import React from "react";
import {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
  FieldErrors,
} from "react-hook-form";
import { ReservaFrontendType } from "@/validators/reserva.schema";
import ResponsableForm from "./ResponsableForm";

interface Props {
  register: UseFormRegister<ReservaFrontendType>;
  watch: UseFormWatch<ReservaFrontendType>;
  setValue: UseFormSetValue<ReservaFrontendType>;
  errors: FieldErrors<ReservaFrontendType>;
}

export const UsoReservaForm: React.FC<Props> = ({
  register,
  watch,
  setValue,
  errors,
}) => {
  const usoReserva = watch("usoReserva");
  const socioPresente = watch("socioPresente");

  return (
    <section className="space-y-4 border-t pt-4">
      <h4 className="text-sm font-semibold text-gray-800">
        Uso de la Reserva
      </h4>

      {/* Tipo de uso */}
      <div>
        <label className="text-xs font-medium text-gray-700">
          Tipo de uso
        </label>

        <select
          {...register("usoReserva")}
          value={usoReserva}
          onChange={(e) =>
            setValue("usoReserva", e.target.value as ReservaFrontendType["usoReserva"])
          }
          className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
        >
          <option value="USO_PERSONAL">Uso personal</option>
          <option value="CARGA_DIRECTA">Carga directa</option>
          <option value="TERCEROS">Terceros (uso externo)</option>
        </select>
      </div>

      {/* Socio presente */}
      <label className="flex items-center gap-2 text-xs cursor-pointer">
        <input
          type="checkbox"
          checked={socioPresente}
          onChange={(e) =>
            setValue("socioPresente", e.target.checked, { shouldValidate: true })
          }
        />
        El socio estará presente
      </label>

      {/* Responsable */}
      {!socioPresente && (
        <ResponsableForm
          register={register}
          watch={watch}
          setValue={setValue}
          errors={errors}
        />
      )}
    </section>
  );
};

export default UsoReservaForm;
