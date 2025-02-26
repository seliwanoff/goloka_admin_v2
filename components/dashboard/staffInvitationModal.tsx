"use client";

import React, { useState, useRef, ChangeEvent, FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShieldPlus, Upload, X } from "lucide-react";
import Image from "next/image";
import { z } from "zod";

// Form validation schema
const staffSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  role: z.string().min(1, "Please select a role"),
});

// TypeScript interfaces
interface FormData {
  name: string;
  email: string;
  phone: string;
  role: string;
}

interface FormErrors {
  [key: string]: string | null;
}

interface StaffInviteModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const StaffInviteModal: React.FC<StaffInviteModalProps> = ({
  open,
  setOpen,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    role: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value }));
    if (errors.role) {
      setErrors((prev) => ({ ...prev, role: null }));
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setProfileImage(files[0]);
      // Create preview URL
      const url = URL.createObjectURL(files[0]);
      setPreviewUrl(url);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const validateForm = (): boolean => {
    try {
      staffSchema.parse(formData);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: FormErrors = {};
        error.errors.forEach(
          (err: { path: (string | number)[]; message: string | null }) => {
            if (err.path[0]) {
              formattedErrors[err.path[0]] = err.message;
            }
          }
        );
        setErrors(formattedErrors);
      }
      return false;
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Log the form data and image to console
      console.log("Form Data:", formData);
      console.log("Profile Image:", profileImage);

      // Here you would typically send this data to your API

      // Close the modal after successful submission
      setOpen(false);

      // Reset form
      setFormData({ name: "", email: "", phone: "", role: "" });
      setProfileImage(null);
      setPreviewUrl(null);
      setErrors({});
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-auto rounded-full bg-main-100 px-8 py-3 text-white hover:bg-blue-700 space-x-3">
          <span className="mr-3">
            <ShieldPlus size="16" color="#fff" />
          </span>
          Add new staff
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            Invite new staff
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <p className="text-center text-gray-600 mb-8">
            The role selected defines this user permission, see permission
            settings page for more details
          </p>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Staff name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Input staff name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Input email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone number</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Input phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={handleRoleChange}>
                  <SelectTrigger
                    id="role"
                    className={errors.role ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-red-500 text-sm">{errors.role}</p>
                )}
              </div>
            </div>

            <div className="mt-8 border border-dashed border-gray-300 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {previewUrl ? (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden">
                      <Image
                        src={previewUrl}
                        alt="Profile"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <Upload size={20} className="text-gray-400" />
                    </div>
                  )}
                  <p className="text-gray-600">Upload profile picture</p>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />

                <Button
                  type="button"
                  onClick={triggerFileInput}
                  variant="outline"
                  className="text-blue-600"
                >
                  Upload
                </Button>
              </div>
            </div>

            <div className="mt-8">
              <Button
                type="submit"
                className="w-full bg-main-100 hover:bg-blue-700 text-white rounded-full py-3"
              >
                Invite member
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StaffInviteModal;
