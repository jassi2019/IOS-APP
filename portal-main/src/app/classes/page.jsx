"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Library, Trash } from "lucide-react";
import Loader from "@/components/custom/loader";
import useToast from "@/hooks/useToast";
import {
  getClasses,
  createClass,
  updateClass,
  deleteClass,
} from "@/services/class";

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [isLoading, setIsLoading] = useState(false);

  const { showError, showSuccess } = useToast();

  const loadClasses = async () => {
    try {
      setIsLoading(true);
      const { data } = await getClasses();
      setClasses(data);
    } catch (error) {
      showError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onAddClass = () => {
    setIsOpen(true);
    setEditingClass(null);
    setFormData({ name: "", description: "" });
  };

  const onEdit = (classItem) => {
    setIsOpen(true);
    setEditingClass(classItem);
    setFormData({ name: classItem.name, description: classItem.description });
  };

  const onCancel = () => {
    setIsOpen(false);
    setEditingClass(null);
    setFormData({ name: "", description: "" });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (editingClass) {
        await updateClass(editingClass.id, formData);
      } else {
        await createClass(formData);
      }
      await loadClasses();
      onCancel();
      showSuccess(`Class ${editingClass ? "updated" : "added"} successfully`);
    } catch (error) {
      showError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async (classItem) => {
    if (confirm("Are you sure you want to delete this class?")) {
      try {
        setIsLoading(true);
        await deleteClass(classItem.id);
        await loadClasses();
        showSuccess("Class deleted successfully");
      } catch (error) {
        showError(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Classes
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your NEET preparation classes
              </p>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button onClick={onAddClass} size="sm" className="shadow-sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Class
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingClass ? "Edit Class" : "Add New Class"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Class Name
                    </label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Enter class name"
                      className="shadow-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="description"
                      className="text-sm font-medium"
                    >
                      Description
                    </label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Enter class description"
                      className="shadow-sm resize-none"
                      rows={4}
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={onCancel}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={!formData.name || !formData.description}
                    >
                      {editingClass ? "Update" : "Add"} Class
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem) => (
            <Card
              key={classItem.id}
              className="group hover:shadow-lg transition-shadow duration-200 border-muted"
            >
              <CardHeader className="relative">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Library className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-semibold">
                      {classItem.name}
                    </CardTitle>
                  </div>
                </div>
                <Button
                  variant="solid"
                  size="icon"
                  onClick={() => onDelete(classItem)}
                  className="absolute right-6 top-6"
                >
                  <Trash className="h-4 w-4" />
                </Button>
                <Button
                  variant="solid"
                  size="icon"
                  onClick={() => onEdit(classItem)}
                  className="absolute right-20 top-6"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  {classItem.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
