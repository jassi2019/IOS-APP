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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Pencil,
  BookOpen,
  GraduationCap,
  BookType,
  Trash,
} from "lucide-react";
import Loader from "@/components/custom/loader";
import useToast from "@/hooks/useToast";
import {
  getChapters,
  createChapter,
  updateChapter,
  deleteChapter,
} from "@/services/chapter";

import { getSubjects } from "@/services/subject";
import { getClasses } from "@/services/class";

export default function ChaptersPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { showError, showSuccess } = useToast();
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [chapters, setChapters] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    number: 1,
    subjectId: "",
    classId: "",
  });

  const loadInitials = async () => {
    try {
      setIsLoading(true);
      const { data: newSubjects } = await getSubjects();
      const { data: newClasses } = await getClasses();
      setSubjects(newSubjects);
      setClasses(newClasses);
      const { data: newChapters } = await getChapters();
      setChapters(newChapters);
    } catch (error) {
      showError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onAddChapter = () => {
    setIsOpen(true);
    setEditingChapter(null);
    setFormData({
      name: "",
      description: "",
      number: 1,
      subjectId: "",
      classId: "",
    });
  };

  const onEditChapter = (chapter) => {
    setIsOpen(true);
    setEditingChapter(chapter);
    setFormData({
      name: chapter.name,
      description: chapter.description,
      number: chapter.number,
      subjectId: chapter.subjectId,
      classId: chapter.classId,
    });
  };

  const onDelete = async (chapter) => {
    if (confirm("Are you sure you want to delete this chapter?")) {
      try {
        setIsLoading(true);
        await deleteChapter(chapter.id);
        await loadInitials();
        showSuccess("Chapter deleted successfully");
      } catch (error) {
        showError(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getSubjectName = (subjectId) =>
    subjects.find((s) => s.id === subjectId)?.name || "Unknown Subject";

  const getClassName = (classId) =>
    classes.find((c) => c.id === classId)?.name || "Unknown Class";

  const onClose = () => {
    setIsOpen(false);
    setEditingChapter(null);
    setFormData({
      name: "",
      description: "",
      number: 1,
      subjectId: "",
      classId: "",
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (editingChapter) {
        await updateChapter(editingChapter.id, formData);
      } else {
        await createChapter(formData);
      }
      await loadInitials();
      onClose();
    } catch (error) {
      showError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInitials();
  }, []);

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Chapters
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your NEET preparation chapters
              </p>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button onClick={onAddChapter} size="sm" className="shadow-sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Chapter
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingChapter ? "Edit Chapter" : "Add New Chapter"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject
                    </label>
                    <Select
                      value={formData.subjectId?.toString()}
                      onValueChange={(value) =>
                        setFormData({ ...formData, subjectId: value })
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem
                            key={subject.id}
                            value={subject.id.toString()}
                          >
                            {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="class" className="text-sm font-medium">
                      Class
                    </label>
                    <Select
                      value={formData.classId?.toString()}
                      onValueChange={(value) =>
                        setFormData({ ...formData, classId: value })
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((cls) => (
                          <SelectItem key={cls.id} value={cls.id.toString()}>
                            {cls.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="number" className="text-sm font-medium">
                      Chapter Number
                    </label>
                    <Input
                      id="number"
                      value={formData.number}
                      onChange={(e) =>
                        setFormData({ ...formData, number: e.target.value })
                      }
                      placeholder="Enter chapter number"
                      className="shadow-sm"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Chapter Name
                    </label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Enter chapter name"
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
                      placeholder="Enter chapter description"
                      className="shadow-sm resize-none"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={
                        !formData.name ||
                        !formData.description ||
                        !formData.subjectId ||
                        !formData.classId
                      }
                    >
                      {editingChapter ? "Update" : "Add"} Chapter
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
          {chapters.map((chapter) => (
            <Card
              key={chapter.id}
              className="group hover:shadow-lg transition-shadow duration-200 border-muted"
            >
              <CardHeader className="relative">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-semibold">
                      {chapter.name}
                    </CardTitle>
                  </div>
                </div>
                <Button
                  variant="solid"
                  size="icon"
                  onClick={() => onDelete(chapter)}
                  className="absolute right-6 top-6"
                >
                  <Trash className="h-4 w-4" />
                </Button>
                <Button
                  variant="solid"
                  size="icon"
                  onClick={() => onEditChapter(chapter)}
                  className="absolute right-20 top-6"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  {chapter.description}
                </p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-sm">
                    <BookType className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {getSubjectName(chapter.subjectId)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <GraduationCap className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {getClassName(chapter.classId)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {chapter.number || "N/A"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
