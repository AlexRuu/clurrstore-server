"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { HomeImage } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AlertModal from "@/components/alert-modal";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Trash } from "lucide-react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import ImageUpload from "@/components/ui/image-upload";

const formSchema = z.object({
  url: z.string().min(1),
});

type HomeImgFormValues = z.infer<typeof formSchema>;

interface HomeImageFormProps {
  initialData: HomeImage | null;
}

const HomeImgForm: React.FC<HomeImageFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const title = initialData ? "Edit Home Image" : "Create A New Home Image";
  const description = initialData
    ? "Edit home image"
    : "Create a new home image";
  const toastMessage = initialData
    ? "Home Image Updated"
    : "Home Image Created";
  const action = initialData ? "Save Changes" : "Create Home Image";

  const form = useForm<HomeImgFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      url: "",
    },
  });

  const onSubmit = async (data: HomeImgFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/homeImgs/${params.homeImgId}`, data);
      } else {
        await axios.post("/api/homeImgs", data);
      }
      router.refresh();
      router.push("/homeImgs");
      toast.success(toastMessage);
    } catch (error) {
      toast.error("Something went wrong...");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/homeImgs/${params.homeImgId}`);
      router.refresh();
      router.push("/homeImgs");
      toast.success("Home image deleted!");
    } catch (error) {
      toast.error("Something went wrong...");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const onCancel = () => {
    router.refresh();
    router.push("/homeImgs");
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        loading={loading}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
      />
      <div className="flex items-center justify-between pb-4">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <div className="flex flex-col justify-center items-center pt-6">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-1/4"
          >
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Home Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value ? [field.value] : []}
                      disabled={loading}
                      onChange={(url) => field.onChange(url)}
                      onRemove={() => field.onChange("")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between pl-9 pr-9">
              <Button type="submit">{action}</Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </Form>
    </>
  );
};

export default HomeImgForm;
