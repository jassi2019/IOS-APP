"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Plus,
  Pencil,
  BookOpen,
  GraduationCap,
  BookType,
  Crown,
  ListOrdered,
  IndianRupee,
  Trash,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import Loader from "@/components/custom/loader";
import useToast from "@/hooks/useToast";
import { getTopics, deleteTopic } from "@/services/topics";
import Image from "next/image";

export default function TopicsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [topics, setTopics] = useState([]);

  const { showError, showSuccess } = useToast();

  const loadTopics = async () => {
    setIsLoading(true);
    try {
      const { data } = await getTopics();
      setTopics(data);
    } catch (error) {
      showError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTopics();
  }, []);

  const router = useRouter();

  const onAddNewTopic = () => {
    router.push("/topics/add");
  };

  const onEditTopic = (topicId) => {
    router.push(`/topics/${topicId}`);
  };

  const onDeleteTopic = async (topicId) => {
    if (confirm("Are you sure you want to delete this topic?")) {
      setIsLoading(true);
      try {
        await deleteTopic(topicId);
        await loadTopics();
        showSuccess("Topic deleted successfully");
      } catch (error) {
        showError(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

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
                Topics
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Master your NEET preparation one topic at a time
              </p>
            </div>
            <Button
              size="lg"
              className="shadow-lg hover:shadow-primary/25 transition-all"
              onClick={onAddNewTopic}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Topic
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Content Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <Card
              key={topic.id}
              className="group hover:shadow-xl transition-all duration-300 border-muted/50 relative overflow-hidden"
            >
              <div className="relative w-full h-48 overflow-hidden">
                <Image
                  src={topic.contentThumbnail || "/images/topic-default.jpg"}
                  alt={topic.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  priority={false}
                />
                {topic.serviceType === "PREMIUM" && (
                  <div className="absolute top-3 right-3 z-10">
                    <Badge
                      variant="premium"
                      className="bg-gradient-to-r from-yellow-400 to-amber-600 text-white"
                    >
                      <Crown className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  </div>
                )}

                {topic.serviceType === "FREE" && (
                  <div className="absolute top-3 right-3 z-10">
                    <Badge
                      variant="free"
                      className="bg-gradient-to-r from-green-400 to-green-600 text-white"
                    >
                      <IndianRupee className="w-3 h-3 mr-1" />
                      Free
                    </Badge>
                  </div>
                )}
              </div>

              <CardHeader className="relative pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-semibold line-clamp-1">
                      {topic.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {topic.Chapter.name}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pb-4">
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {topic.description}
                </p>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-sm bg-muted/50 p-2 rounded-lg">
                    <BookType className="w-4 h-4 text-primary" />
                    <span>{topic.Subject.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm bg-muted/50 p-2 rounded-lg">
                    <GraduationCap className="w-4 h-4 text-primary" />
                    <span>{topic.Class.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm bg-muted/50 p-2 rounded-lg">
                    <ListOrdered className="w-4 h-4 text-primary" />
                    <span>Sequence {topic.sequence}</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-2 pb-4 space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditTopic(topic.id)}
                  className="w-full hover:bg-primary hover:text-white transition-colors"
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Topic
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDeleteTopic(topic.id)}
                  className="w-full hover:bg-red-500 hover:text-white transition-colors"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete Topic
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
