"use client";

import { useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  screeningSchema,
  type ScreeningFormInput,
  type ScreeningFormOutput,
} from "@/lib/validation/screening";
import { createScreeningAction } from "@/lib/actions/screening";
import { clinicalQuestions, contactIntro, declarationText, type ClinicalQuestionKey } from "@/lib/questions";
import { formatDuration } from "@/lib/dates";
import { TextField } from "./ui/TextField";
import { RadioGroup } from "./ui/RadioGroup";
import { YesNoToggle } from "./ui/YesNoToggle";
import { Checkbox } from "./ui/Checkbox";
import { Button } from "./ui/Button";
import { Notice } from "./ui/Notice";

type Profile = {
  fullName: string;
  department: string;
  phone: string;
  email: string | null;
};

const SECTION_NAV = [
  { id: "section-personal", label: "A. Personal data" },
  { id: "section-travel", label: "B. Travel information" },
  { id: "section-clinical", label: "C. Clinical data" },
  { id: "section-declaration", label: "D. Declaration" },
];

const defaultClinicalAnswers = Object.fromEntries(
  clinicalQuestions.map((q) => [q.key, undefined])
) as Record<ClinicalQuestionKey, boolean | undefined>;

export function ScreeningForm({ profile }: { profile: Profile }) {
  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ScreeningFormInput, unknown, ScreeningFormOutput>({
    resolver: zodResolver(screeningSchema),
    defaultValues: {
      fullName: profile.fullName,
      department: profile.department,
      age: undefined,
      sex: undefined,
      phone: profile.phone,
      email: profile.email ?? "",
      purpose: undefined,
      purposeOther: "",
      fromCountry: "Uganda",
      destination: "",
      departureDate: "",
      returnDate: "",
      flight: "",
      ...defaultClinicalAnswers,
      declarationAccepted: false,
    } as unknown as ScreeningFormInput,
  });

  const purpose = watch("purpose");
  const departureDate = watch("departureDate");
  const returnDate = watch("returnDate");
  const duration = departureDate && returnDate ? formatDuration(departureDate, returnDate) : null;

  const triggerKeys = clinicalQuestions.filter((q) => q.triggersReview).map((q) => q.key);
  const triggerValues = watch(triggerKeys);
  const anyTriggered = triggerValues.some((v) => v === true);

  const onSubmit = async (data: ScreeningFormOutput) => {
    const result = await createScreeningAction(data);
    if (result && result.ok === false) {
      if (result.fieldErrors) {
        for (const [field, message] of Object.entries(result.fieldErrors)) {
          setError(field as keyof ScreeningFormInput, { message });
        }
      }
    }
  };

  const onInvalid = () => {
    // Scroll to the first field that failed validation.
    const firstErrorKey = Object.keys(errors)[0];
    if (!firstErrorKey || !formRef.current) return;
    const el = formRef.current.querySelector(`[data-field-name="${firstErrorKey}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="lg:grid lg:grid-cols-[180px_1fr] lg:items-start lg:gap-12">
      <nav
        aria-label="Form sections"
        className="sticky top-24 mb-8 hidden flex-col gap-1 lg:flex"
      >
        {SECTION_NAV.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="rounded-[6px] px-2.5 py-1.5 text-sm font-medium text-[var(--color-muted)] hover:bg-[var(--color-page-bg)] hover:text-[var(--color-navy)]"
          >
            {item.label}
          </a>
        ))}
      </nav>

      <form
        ref={formRef}
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        method="post"
        className="flex flex-col gap-10"
        noValidate
      >
      {/* A. Personal data */}
      <section id="section-personal" className="scroll-mt-24 flex flex-col gap-5">
        <h2 className="text-lg font-semibold text-[var(--color-navy)]">A. Personal data</h2>
        <div data-field-name="fullName">
          <TextField label="Full name" error={errors.fullName?.message} {...register("fullName")} />
        </div>
        <div data-field-name="department">
          <TextField label="Department" error={errors.department?.message} {...register("department")} />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div data-field-name="age">
            <TextField
              label="Age"
              type="number"
              min={16}
              max={90}
              error={errors.age?.message}
              {...register("age")}
            />
          </div>
          <div data-field-name="sex">
            <Controller
              name="sex"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  label="Sex"
                  name="sex"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.sex?.message}
                  options={[
                    { value: "FEMALE", label: "Female" },
                    { value: "MALE", label: "Male" },
                  ]}
                />
              )}
            />
          </div>
        </div>
        <div data-field-name="phone">
          <TextField label="Phone / WhatsApp" type="tel" error={errors.phone?.message} {...register("phone")} />
        </div>
        <div data-field-name="email">
          <TextField
            label="Email (optional)"
            type="email"
            error={errors.email?.message}
            {...register("email")}
          />
        </div>
      </section>

      {/* B. Travel information */}
      <section id="section-travel" className="scroll-mt-24 flex flex-col gap-5">
        <h2 className="text-lg font-semibold text-[var(--color-navy)]">B. Travel information</h2>
        <div data-field-name="purpose">
          <Controller
            name="purpose"
            control={control}
            render={({ field }) => (
              <RadioGroup
                label="Purpose of travel"
                name="purpose"
                value={field.value}
                onChange={field.onChange}
                error={errors.purpose?.message}
                options={[
                  { value: "BUSINESS", label: "Business" },
                  { value: "LEAVE", label: "Leave" },
                  { value: "OTHER", label: "Other" },
                ]}
              />
            )}
          />
        </div>
        {purpose === "OTHER" && (
          <div data-field-name="purposeOther">
            <TextField
              label="Please describe the purpose of travel"
              error={errors.purposeOther?.message}
              {...register("purposeOther")}
            />
          </div>
        )}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div data-field-name="fromCountry">
            <TextField
              label="Travelling from"
              error={errors.fromCountry?.message}
              {...register("fromCountry")}
            />
          </div>
          <div data-field-name="destination">
            <TextField
              label="Destination (country and city)"
              placeholder="e.g. Kenya, Nairobi"
              error={errors.destination?.message}
              {...register("destination")}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div data-field-name="departureDate">
            <TextField
              label="Departure date"
              type="date"
              error={errors.departureDate?.message}
              {...register("departureDate")}
            />
          </div>
          <div data-field-name="returnDate">
            <TextField
              label="Return date (optional)"
              type="date"
              error={errors.returnDate?.message}
              {...register("returnDate")}
            />
          </div>
        </div>
        {duration && (
          <TextField label="Duration of stay" value={duration} readOnly disabled />
        )}
        <div data-field-name="flight">
          <TextField
            label="Airline / flight number (optional)"
            error={errors.flight?.message}
            {...register("flight")}
          />
        </div>
      </section>

      {/* C. Clinical data */}
      <section id="section-clinical" className="scroll-mt-24 flex flex-col gap-6">
        <h2 className="text-lg font-semibold text-[var(--color-navy)]">C. Clinical data</h2>

        <div className="flex flex-col gap-4">
          <p className="text-sm font-medium text-[var(--color-navy)]">{contactIntro}</p>
          {clinicalQuestions
            .filter((q) => q.section === "contact")
            .map((q) => (
              <div key={q.key} data-field-name={q.key}>
                <Controller
                  name={q.key}
                  control={control}
                  render={({ field }) => (
                    <YesNoToggle
                      label={q.formLabel}
                      value={field.value}
                      onChange={field.onChange}
                      error={errors[q.key]?.message}
                    />
                  )}
                />
              </div>
            ))}
        </div>

        <div className="flex flex-col gap-4 border-t border-[var(--color-border)] pt-6">
          <p className="text-sm font-medium text-[var(--color-navy)]">Your own exposure:</p>
          {clinicalQuestions
            .filter((q) => q.section === "own")
            .map((q) => (
              <div key={q.key} data-field-name={q.key}>
                <Controller
                  name={q.key}
                  control={control}
                  render={({ field }) => (
                    <YesNoToggle
                      label={q.formLabel}
                      value={field.value}
                      onChange={field.onChange}
                      error={errors[q.key]?.message}
                    />
                  )}
                />
              </div>
            ))}
        </div>

        {anyTriggered && (
          <Notice tone="warning">
            Based on your answers, please contact the GPOC clinic before you travel.
          </Notice>
        )}

        <div className="flex flex-col gap-4 border-t border-[var(--color-border)] pt-6">
          <p className="text-sm font-medium text-[var(--color-navy)]">Awareness:</p>
          {clinicalQuestions
            .filter((q) => q.section === "awareness")
            .map((q) => (
              <div key={q.key} data-field-name={q.key}>
                <Controller
                  name={q.key}
                  control={control}
                  render={({ field }) => (
                    <YesNoToggle
                      label={q.formLabel}
                      value={field.value}
                      onChange={field.onChange}
                      error={errors[q.key]?.message}
                    />
                  )}
                />
              </div>
            ))}
        </div>
      </section>

      {/* D. Declaration */}
      <section id="section-declaration" className="scroll-mt-24 flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-[var(--color-navy)]">D. Declaration</h2>
        <div data-field-name="declarationAccepted">
          <Checkbox
            label={declarationText}
            error={errors.declarationAccepted?.message}
            {...register("declarationAccepted")}
          />
        </div>
      </section>

      <Notice tone="info">
        Submissions cannot be edited once submitted, because they are a health declaration. If
        something was wrong, submit a new one.
      </Notice>

      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? "Submitting…" : "Submit screening"}
      </Button>
      </form>
    </div>
  );
}
