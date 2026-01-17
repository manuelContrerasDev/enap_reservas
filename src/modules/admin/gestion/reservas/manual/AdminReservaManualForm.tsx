// AdminReservaManualForm.tsx

import type { UseFormReturn } from "react-hook-form";
import type { ReservaManualFormValues } from "../schemas/ReservaManualFormValues";

import { AdminStep1_DatosSocioEspacio } from "./AdminStep1_DatosSocioEspacio";
import { AdminStep2_CantidadesResumen } from "./AdminStep2_CantidadesResumen";
import { AdminStep3_Invitados } from "./AdminStep3_Invitados";
import AdminDatosResponsable from "./AdminDatosResponsable";


interface Props {
  form: UseFormReturn<ReservaManualFormValues>;
  onNext: () => void;
}

export const AdminReservaManualForm = ({ form, onNext }: Props) => {
  const { register, watch, setValue, formState } = form;

  const socioPresente = watch("socioPresente");

  return (
    <div className="space-y-12">

      <AdminStep1_DatosSocioEspacio
        register={register}
        watch={watch}
        setValue={setValue}
        errors={formState.errors}
      />

      <AdminStep2_CantidadesResumen
        register={register}
        watch={watch}
        errors={formState.errors}
      />

      <AdminDatosResponsable
        register={register}
        errors={formState.errors}
        visible={!socioPresente}
      />

      <AdminStep3_Invitados
        register={register}
        watch={watch}
        setValue={setValue}
        errors={formState.errors}
      />

      <div className="flex justify-end pt-6 border-t">
        <button
          type="button"
          onClick={onNext}
          className="btn-primary"
        >
          Revisar y confirmar
        </button>
      </div>

    </div>
  );
};
