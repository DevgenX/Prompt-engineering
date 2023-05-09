"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Form from "@components/Form";

const EditPrompt = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitted] = useState(false);
  const searchParams = useSearchParams();
  console.log(searchParams);
  const promptId = searchParams.get("id");
  const [post, setPost] = useState({
    prompt: "",
    tag: "",
  });

  useEffect(() => {
    const getPromptDetails = async () => {
      const response = await fetch(`/api/prompt/${promptId}`);
      const data = await response.json();

      setPost({
        prompt: data.prompt,
        tag: data.tag,
      });
    };

    if (promptId) getPromptDetails();
  }, [promptId]);

  const handleUpdatePrompt = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!promptId) return alert("Prompt not found");

    try {
      const response = await fetch(`/api/prompt/${promptId}`, {
        method: "PATCH",
        body: JSON.stringify({
          prompt: post.prompt,
          tag: post.tag,
        }),
      });

      if (response.ok) {
        router.push("/");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitted(false);
    }
  };

  return (
    <div>
      <Form
        type="Edit"
        post={post}
        setPost={setPost}
        submitting={isSubmitting}
        handleSubmit={handleUpdatePrompt}
      />
    </div>
  );
};
export default EditPrompt;
