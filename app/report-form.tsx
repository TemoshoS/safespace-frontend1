// app/report-form.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { useLocalSearchParams } from "expo-router";
import SubstanceAbuseForm from "./report_forms/SubstanceAbuseForm";
import TeenagePregnancyForm from "./report_forms/TeenagePregnancyForm";

export default function ReportForm() {
  const { abuseTypeID } = useLocalSearchParams<{ abuseTypeID?: string }>();
  const { control, handleSubmit, setValue } = useForm({ defaultValues: {} });
  const [imageBase64, setImageBase64] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const onSubmit = (data: any) => {
    console.log("Submit payload", { ...data, imageBase64, abuseTypeID });
  };

  switch (abuseTypeID) {
    case "1":
      return <SubstanceAbuseForm control={control} handleSubmit={handleSubmit(onSubmit)} loading={loading} setImageBase64={setImageBase64} />;
    case "2":
      return <TeenagePregnancyForm control={control} handleSubmit={handleSubmit(onSubmit)} loading={loading} setImageBase64={setImageBase64} />;
    default:
      return <></>;
  }
}
