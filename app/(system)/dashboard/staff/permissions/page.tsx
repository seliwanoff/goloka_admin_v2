"use client";
import CustomBreadCrumbs from "@/components/lib/navigation/custom_breadcrumbs";
import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface RoleButtonProps {
  title: string;
  isActive?: boolean;
  onClick?: () => void;
}

interface PermissionButtonProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const RoleButton: React.FC<RoleButtonProps> = ({
  title,
  isActive = false,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between w-full py-4 px-6 rounded-full text-sm transition-colors ${
        isActive
          ? "bg-blue-100 text-blue-500 font-medium"
          : "bg-gray-50 text-gray-700 hover:bg-gray-100"
      }`}
    >
      <span>{title}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
};

const PermissionButton: React.FC<PermissionButtonProps> = ({
  label,
  active = false,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-full text-sm transition-colors ${
        active
          ? "bg-blue-500 text-white"
          : "bg-blue-50 text-blue-500 hover:bg-blue-100"
      }`}
    >
      {label}
    </button>
  );
};

const AddRoleModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (roleName: string, selectedPermissions: string[]) => void;
  availablePermissions: string[];
}> = ({ isOpen, onClose, onSubmit, availablePermissions }) => {
  const [roleName, setRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const togglePermission = (permission: string) => {
    setSelectedPermissions((prev) => {
      if (prev.includes(permission)) {
        return prev.filter((p) => p !== permission);
      } else {
        return [...prev, permission];
      }
    });
  };

  const handleSubmit = () => {
    if (roleName.trim()) {
      onSubmit(roleName, selectedPermissions);
      // Reset form
      setRoleName("");
      setSelectedPermissions([]);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add new role</DialogTitle>
          <DialogDescription>
            Input role name and select the features this role will have access
            to
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div>
            <p className="text-sm font-medium mb-2">Role title</p>
            <Input
              placeholder="Input role name"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="w-full rounded-lg"
            />
          </div>

          <div>
            <p className="text-sm font-medium mb-3">
              Select actions this role access
            </p>
            <div className="flex flex-wrap gap-3">
              {availablePermissions.map((permission) => (
                <PermissionButton
                  key={permission}
                  label={permission}
                  active={selectedPermissions.includes(permission)}
                  onClick={() => togglePermission(permission)}
                />
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleSubmit}
            className="w-full h-auto rounded-full bg-main-100 px-8 py-3 text-white hover:bg-blue-700"
          >
            Create role
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const RolesPermissionsPanel: React.FC<{
  isAddRoleModalOpen: boolean;
  setIsAddRoleModalOpen: (value: boolean) => void;
  onSaveChanges: (permissions: Record<string, string[]>) => void;
}> = ({ isAddRoleModalOpen, setIsAddRoleModalOpen, onSaveChanges }) => {
  // State for managing roles and permissions
  const [selectedRole, setSelectedRole] = useState<string>("Super Admin");
  const [permissions, setPermissions] = useState<Record<string, string[]>>({
    "Super Admin": ["Access to dashboard", "Access control"],
    Admin: ["Access to dashboard", "Manage users", "Manage report"],
    Manager: ["View report", "View trips", "Manage trips"],
  });

  // All available permissions
  const allPermissions = [
    "Access to dashboard",
    "Invite new staff",
    "View report",
    "View trips",
    "Manage trips",
    "Manage users",
    "Access control",
    "Permission name",
    "View community",
    "Manage report",
    "Invite new user",
    "Request for delivery",
    "View accounts",
  ];

  const togglePermission = (permission: string) => {
    setPermissions((prev) => {
      const currentRolePermissions = [...(prev[selectedRole] || [])];

      if (currentRolePermissions.includes(permission)) {
        return {
          ...prev,
          [selectedRole]: currentRolePermissions.filter(
            (p) => p !== permission
          ),
        };
      } else {
        return {
          ...prev,
          [selectedRole]: [...currentRolePermissions, permission],
        };
      }
    });
  };

  const handleCreateRole = (
    roleName: string,
    selectedPermissions: string[]
  ) => {
    console.log("New Role Created:", {
      roleName,
      permissions: selectedPermissions,
    });

    // Add the new role to the permissions state
    setPermissions((prev) => ({
      ...prev,
      [roleName]: selectedPermissions,
    }));
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-7xl ">
      {/* Roles Card */}
      <div className="w-full md:w-2/5 bg-white p-8 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl text-[#333333]">Roles</h2>
        </div>

        <div className="space-y-3">
          {Object.keys(permissions).map((role) => (
            <RoleButton
              key={role}
              title={role}
              isActive={selectedRole === role}
              onClick={() => setSelectedRole(role)}
            />
          ))}
        </div>
      </div>

      {/* Permissions Card */}
      <div className="w-full md:w-3/5 bg-white p-8 rounded-xl shadow-sm">
        <h2 className="text-xl text-[#333333] mb-2">Permissions</h2>
        <p className="text-gray-600 text-sm mb-6">
          Select or deselect a permission to make changes to what certain role
          have access to
        </p>

        <div className="flex flex-wrap gap-3">
          {allPermissions.map((permission) => (
            <PermissionButton
              key={permission}
              label={permission}
              active={permissions[selectedRole]?.includes(permission)}
              onClick={() => togglePermission(permission)}
            />
          ))}
        </div>
      </div>

      {/* Add Role Modal */}
      <AddRoleModal
        isOpen={isAddRoleModalOpen}
        onClose={() => setIsAddRoleModalOpen(false)}
        onSubmit={handleCreateRole}
        availablePermissions={allPermissions}
      />
    </div>
  );
};

export default function RolesPage() {
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [permissions, setPermissions] = useState<Record<string, string[]>>({
    "Super Admin": ["Access to dashboard", "Access control"],
    Admin: ["Access to dashboard", "Manage users", "Manage report"],
    Manager: ["View report", "View trips", "Manage trips"],
  });

  const handleSaveChanges = () => {
    console.log("Saving all permissions:", permissions);
    // Here you would typically make an API call to save the permissions
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 ">
      <div className="my-4 flex items-center justify-between">
        <CustomBreadCrumbs />

        <div className="flex items-center gap-4">
          <Button
            onClick={() => setIsAddRoleModalOpen(true)}
            className="h-auto rounded-full bg-white px-8 py-3 text-main-100 hover:bg-blue-50 border border-main-100"
          >
            Create new role
          </Button>
          <Button
            onClick={handleSaveChanges}
            className="h-auto rounded-full bg-main-100 px-8 py-3 text-white hover:bg-blue-700 space-x-3"
          >
            Save Changes
          </Button>
        </div>
      </div>
      <RolesPermissionsPanel
        isAddRoleModalOpen={isAddRoleModalOpen}
        setIsAddRoleModalOpen={setIsAddRoleModalOpen}
        onSaveChanges={handleSaveChanges}
      />
    </div>
  );
}
