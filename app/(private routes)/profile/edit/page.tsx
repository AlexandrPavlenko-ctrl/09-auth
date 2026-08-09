"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import NextImage from "next/image";
import dynamic from "next/dynamic";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMe, uploadAvatar } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./EditProfilePage.module.css";

// Експортуємо як іменовану функцію для динамічного імпорту нижче
export function EditProfileComponent() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 100, height: 100 });

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOriginCrop, setDragOriginCrop] = useState({ x: 0, y: 0 });
  const cropAreaRef = useRef<HTMLDivElement>(null);

  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const avatarSrc =
    avatarPreview ||
    user?.avatar ||
    "https://ac.goit.global/fullstack/react/default-avatar.jpg";

  const mutation = useMutation({
    mutationFn: updateMe,
    onSuccess: (updatedUserData) => {
      setUser(updatedUserData);
      queryClient.invalidateQueries({ queryKey: ["session"] });
      router.push("/profile");
    },
    onError: (error: unknown) => {
      let message = "Failed to update profile.";
      if (typeof error === "string") {
        message = error;
      } else if (typeof error === "object" && error !== null) {
        const err = error as { response?: { data?: { message?: string } } };
        message = err.response?.data?.message ?? message;
      }
      setError(message);
    },
  });

  const handleAvatarPick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setCrop({ x: 0, y: 0, width: 100, height: 100 });
  };

  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const handleCropMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragStart({ x: event.clientX, y: event.clientY });
    setDragOriginCrop({ x: crop.x, y: crop.y });
  };

  const handleCropMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !cropAreaRef.current) return;

    const bounds = cropAreaRef.current.getBoundingClientRect();
    const deltaX = event.clientX - dragStart.x;
    const deltaY = event.clientY - dragStart.y;

    const nextX = Math.max(
      0,
      Math.min(
        100 - crop.width,
        dragOriginCrop.x + (deltaX / bounds.width) * 100,
      ),
    );
    const nextY = Math.max(
      0,
      Math.min(
        100 - crop.height,
        dragOriginCrop.y + (deltaY / bounds.height) * 100,
      ),
    );

    setCrop((prev) => ({ ...prev, x: nextX, y: nextY }));
  };

  const handleCropMouseUp = () => setIsDragging(false);

  const handleCropChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setCrop((prev) => ({ ...prev, width: value, height: value }));
  };

  const handleFormAction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const username = ((formData.get("username") as string) || "").trim();

    if (!username) {
      setError("Username is required.");
      return;
    }

    if (!user) {
      setError("User session not found.");
      return;
    }

    try {
      if (selectedFile) {
        const canvas = document.createElement("canvas");
        const img = new Image();
        img.src = avatarPreview || "";

        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error("Failed to load image."));
        });

        const cropSize = Math.min(img.width, img.height) * (crop.width / 100);
        const cropX = (img.width * crop.x) / 100;
        const cropY = (img.height * crop.y) / 100;
        const cropWidth = Math.min(img.width - cropX, cropSize);
        const cropHeight = Math.min(img.height - cropY, cropSize);

        canvas.width = 120;
        canvas.height = 120;
        const ctx = canvas.getContext("2d");

        if (!ctx) throw new Error("Canvas is not supported.");

        ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, 120, 120);

        const croppedBlob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Failed to create avatar image."));
          }, "image/png");
        });

        const avatarFile = new File([croppedBlob], "avatar.png", {
          type: "image/png",
        });

        await uploadAvatar(avatarFile);
      }

      mutation.mutate({
        username,
        email: user.email,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update profile.";
      setError(message);
    }
  };

  if (!user) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>Loading...</div>
    );
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <form onSubmit={handleFormAction}>
          <div className={css.avatarWrapper}>
            {avatarPreview ?
              <div
                ref={cropAreaRef}
                className={css.cropArea}
                onMouseDown={handleCropMouseDown}
                onMouseMove={handleCropMouseMove}
                onMouseUp={handleCropMouseUp}
                onMouseLeave={handleCropMouseUp}
              >
                <NextImage
                  src={avatarSrc}
                  alt="User Avatar"
                  width={240}
                  height={240}
                  className={css.avatarPreview}
                  priority
                />
                <div
                  className={css.cropFrame}
                  style={{
                    left: `${crop.x}%`,
                    top: `${crop.y}%`,
                    width: `${crop.width}%`,
                    height: `${crop.height}%`,
                  }}
                />
              </div>
            : <NextImage
                src={avatarSrc}
                alt="User Avatar"
                width={120}
                height={120}
                className={css.avatar}
                priority
              />
            }

            <button
              type="button"
              className={css.changeAvatarButton}
              onClick={() => fileInputRef.current?.click()}
            >
              Change avatar
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleAvatarPick}
            />

            {avatarPreview && (
              <div className={css.cropControls}>
                <label htmlFor="crop-size">Crop size</label>
                <input
                  id="crop-size"
                  type="range"
                  min="10"
                  max="100"
                  value={crop.width}
                  onChange={handleCropChange}
                />
              </div>
            )}
          </div>

          {/* ПОЛЯ ВВОДУ: Використовують ваші стилі .profileInfo та .usernameWrapper */}
          <div className={css.profileInfo}>
            <div className={css.usernameWrapper}>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                defaultValue={user.username}
                className={css.input}
              />
            </div>

            <div className={css.usernameWrapper}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={user.email}
                disabled
                className={css.input}
                style={{
                  backgroundColor: "#f8f9fa",
                  cursor: "not-allowed",
                  color: "#6c757d",
                }}
              />
            </div>
          </div>

          {/* КНОПКИ ДІЙ: Використовують ваш рідний клас .actions та додають кнопку Cancel */}
          <div className={css.actions}>
            <button
              type="submit"
              className={css.saveButton}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              className={css.cancelButton}
              onClick={() => router.push("/profile")}
            >
              Cancel
            </button>
          </div>
        </form>

        {error && <p className={css.errorMessage}>{error}</p>}
      </div>
    </main>
  );
}

// Запобігає помилкам гідрації на Vercel
const EditProfilePageNoSSR = dynamic(
  async () => {
    return EditProfileComponent;
  },
  { ssr: false },
);

export default EditProfilePageNoSSR;
