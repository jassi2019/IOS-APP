"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import {
  BookOpen,
  BookType,
  GraduationCap,
  IndianRupee,
  ListOrdered,
  Search,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { createTopic } from "@/services/topics";
import { getChapters } from "@/services/chapter";
import { getSubjects } from "@/services/subject";
import { getClasses } from "@/services/class";
import { getDesigns } from "@/services/canva";
import useToast from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import Loader from "@/components/custom/loader";

export default function AddTopicPage() {
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const { showSuccess, showError } = useToast();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    contentId: "",
    contentURL: "",
    subjectId: "",
    chapterId: "",
    classId: "",
    sequence: 1,
    serviceType: "PREMIUM",
  });

  const loadInitials = async () => {
    setIsLoading(true);
    try {
      const { data: subjectDocs } = await getSubjects();
      const { data: classDocs } = await getClasses();
      const { data: chapterDocs } = await getChapters();

      setSubjects(subjectDocs);
      setClasses(classDocs);
      setChapters(chapterDocs);
    } catch (error) {
      showError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isDirty()) {
      showError("Please fill all the fields");
      return;
    }
    try {
      setIsLoading(true);
      await createTopic(formData);
      showSuccess("Topic created successfully");
      router.push("/topics");
    } catch (error) {
      showError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const isDirty = () => {
    if (
      formData.name === "" ||
      formData.description === "" ||
      formData.contentId === "" ||
      formData.contentURL === "" ||
      formData.subjectId === "" ||
      formData.chapterId === "" ||
      formData.classId === ""
    ) {
      return true;
    }
    return false;
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      showError("Please enter a search query");
      return;
    }

    setIsSearching(true);
    try {
      const { data: searchData } = await getDesigns(searchQuery.trim());
      setSearchResults(searchData);
      setHasSearched(true);
    } catch (error) {
      showError(error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    loadInitials();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Header Section */}
      <div className="border-b bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Add New Topic
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Create a new topic for your NEET preparation
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Basic Information</h2>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          Topic Name
                        </label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder="Enter topic name"
                          required
                          className="shadow-sm"
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
                          placeholder="Enter topic description"
                          rows={4}
                          required
                          className="shadow-sm resize-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="contentURL"
                          className="text-sm font-medium"
                        >
                          Content URL
                        </label>
                        <Input
                          id="contentURL"
                          value={formData.contentURL}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              contentURL: e.target.value,
                            })
                          }
                          placeholder="Enter content URL"
                          required
                          className="shadow-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Classification */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Classification</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <BookType className="w-4 h-4" />
                          Subject
                        </label>
                        <Select
                          value={formData.subjectId?.toString()}
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              subjectId: value,
                            })
                          }
                          required
                        >
                          <SelectTrigger className="shadow-sm">
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            {subjects.map((subject) => (
                              <SelectItem key={subject.id} value={subject.id}>
                                {subject.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <GraduationCap className="w-4 h-4" />
                          Class
                        </label>
                        <Select
                          value={formData.classId?.toString()}
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              classId: value,
                            })
                          }
                          required
                        >
                          <SelectTrigger className="shadow-sm">
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                          <SelectContent>
                            {classes.map((cls) => (
                              <SelectItem key={cls.id} value={cls.id}>
                                {cls.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          Chapter
                        </label>
                        <Select
                          value={formData.chapterId?.toString()}
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              chapterId: value,
                            })
                          }
                          required
                        >
                          <SelectTrigger className="shadow-sm">
                            <SelectValue placeholder="Select chapter" />
                          </SelectTrigger>
                          <SelectContent>
                            {chapters.map((chapter) => (
                              <SelectItem key={chapter.id} value={chapter.id}>
                                {chapter.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <IndianRupee className="w-4 h-4" />
                          Service Type
                        </label>
                        <Select
                          value={formData.serviceType}
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              serviceType: value,
                            })
                          }
                          required
                        >
                          <SelectTrigger className="shadow-sm">
                            <SelectValue placeholder="Select service type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem key="PREMIUM" value="PREMIUM">
                              Premium
                            </SelectItem>
                            <SelectItem key="FREE" value="FREE">
                              Free
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <ListOrdered className="w-4 h-4" />
                          Sequence
                        </label>
                        <Input
                          id="sequence"
                          type="number"
                          min="1"
                          value={formData.sequence}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              sequence: parseInt(e.target.value),
                            })
                          }
                          placeholder="Enter sequence number"
                          required
                          className="shadow-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Content Selection */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Content Selection</h2>
                    <p className="text-sm text-muted-foreground">
                      Search for designs to select content for the topic
                    </p>

                    {/* Search Input and Button */}
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Input
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Enter search query for designs..."
                          className="shadow-sm"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleSearch();
                            }
                          }}
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={handleSearch}
                        disabled={isSearching || !searchQuery.trim()}
                        className="flex items-center gap-2"
                      >
                        <Search className="w-4 h-4" />
                        {isSearching ? "Searching..." : "Search"}
                      </Button>
                    </div>

                    {/* Search Results */}
                    {!hasSearched ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">
                          Enter a search query to find designs
                        </p>
                        <p className="text-sm">
                          Use keywords to search for relevant content
                        </p>
                      </div>
                    ) : searchResults.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">No designs found</p>
                        <p className="text-sm">
                          Try different keywords or search terms
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {searchResults
                          .filter(
                            (content) =>
                              content.thumbnail && content.thumbnail.url
                          )
                          .map((content) => (
                            <div
                              key={content.id}
                              className={`relative border rounded-lg cursor-pointer hover:bg-muted/50 transition-all ${
                                formData.contentId === content.id
                                  ? "border-primary bg-primary/5"
                                  : ""
                              }`}
                              onClick={(e) => {
                                e.preventDefault();
                                setFormData({
                                  ...formData,
                                  contentId: content.id,
                                });
                              }}
                            >
                              <input
                                type="radio"
                                name="content"
                                id={content.id}
                                value={content.id}
                                checked={formData.contentId === content.id}
                                onChange={() => {}}
                                className="sr-only"
                              />
                              <div className="flex items-center gap-4 p-4">
                                <div className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
                                  <Image
                                    src={content.thumbnail.url}
                                    alt={content.title || content.id}
                                    fill
                                    className="object-contain"
                                    priority
                                  />
                                </div>
                                <div>
                                  <h3 className="font-medium">
                                    {content.title}
                                  </h3>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button
                disabled={isLoading || isDirty()}
                type="submit"
                size="lg"
                className="shadow-lg hover:shadow-primary/25 transition-all"
              >
                Add Topic
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
