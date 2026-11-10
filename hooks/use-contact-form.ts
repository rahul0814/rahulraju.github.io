"use client";

import { useCallback, useMemo, useRef, useState, type FormEvent } from "react";
import {
  ALERT_DURATION,
  CONTACT_ERROR_MESSAGE,
  CONTACT_SUCCESS_MESSAGE,
  INITIAL_FORM_STATE,
  REQUIRED_FIELDS,
} from "@/constants/contact-constants";
import {
  type AlertState,
  type AlertType,
  type ContactField,
  type ContactFormData,
} from "@/types/contact-types";

const HIDDEN_ALERT: AlertState = {
  visible: false,
  type: "success",
  message: "",
};

export const useContactForm = () => {
  const [formData, setFormData] = useState<ContactFormData>(INITIAL_FORM_STATE);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<AlertState>(HIDDEN_ALERT);
  const alertTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const update = useCallback((key: ContactField, value: string) => {
    setFormData((previous) => ({ ...previous, [key]: value }));
  }, []);

  const completion = useMemo(() => {
    const filled = REQUIRED_FIELDS.filter((key) => formData[key].trim()).length;
    return filled / REQUIRED_FIELDS.length;
  }, [formData]);

  const showAlert = useCallback((type: AlertType, message: string) => {
    if (alertTimer.current) clearTimeout(alertTimer.current);
    setAlert({ visible: true, type, message });
    alertTimer.current = setTimeout(
      () => setAlert(HIDDEN_ALERT),
      ALERT_DURATION
    );
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      setIsLoading(true);

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }).catch(() => null);

        if (response && response.ok) {
          setFormData(INITIAL_FORM_STATE);
          showAlert("success", CONTACT_SUCCESS_MESSAGE);
        } else {
          // Static hosting fallback (e.g. GitHub Pages)
          const subject = encodeURIComponent(
            `Portfolio Inquiry from ${formData.name}`
          );
          const body = encodeURIComponent(
            `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
          );
          window.location.href = `mailto:rahulraju0814@gmail.com?subject=${subject}&body=${body}`;
          setFormData(INITIAL_FORM_STATE);
          showAlert("success", "Message prepared! Opening your email app...");
        }
      } catch (error) {
        showAlert(
          "danger",
          error instanceof Error ? error.message : CONTACT_ERROR_MESSAGE
        );
      } finally {
        setIsLoading(false);
      }
    },
    [formData, showAlert]
  );

  return { formData, update, completion, isLoading, alert, handleSubmit };
};
