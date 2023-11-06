"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { useFieldArray, useForm } from "react-hook-form";
import { useState } from "react";
import { Category, Design, Image, Product, Style } from "@prisma/client";

import {
  Form,
  FormControl,
  FormDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title must be at least 1 character long",
  }),
  image: z.object({ url: z.string() }).array(),
  description: z.string().min(1),
  price: z.coerce.number().min(1),
  stock: z.coerce.number(),
  detail: z.array(z.object({ text: z.string() })).optional(),
  design: z
    .array(z.object({ title: z.string(), stock: z.coerce.number() }))
    .optional(),
  style: z.array(z.object({ title: z.string() })).optional(),
  categoryId: z.string().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData:
    | (Product & {
        image: Image[];
        design: Design[];
        style: Style[];
      })
    | null;
  categories: Category[];
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,
}) => {
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const title = initialData ? "Edit Product" : "Create A New Product";
  const description = initialData ? "Edit Product" : "Create a new Product";
  const toastMessage = initialData ? "Product Updated" : "Product Created";
  const action = initialData ? "Save Changes" : "Create Product";

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          price: parseFloat(String(initialData?.price)),
        }
      : {
          title: "",
          image: [],
          price: 0,
          description: "",
          categoryId: "",
          stock: 0,
          detail: [{ text: "" }],
          design: [{ title: "", stock: 0 }],
          style: [{ title: "" }],
          isFeatured: false,
          isArchived: false,
        },
  });

  const designArray = useFieldArray({
    name: "design",
    control: form.control,
  });

  const styleArray = useFieldArray({
    name: "style",
    control: form.control,
  });

  const detailArray = useFieldArray({
    name: "detail",
    control: form.control,
  });

  const onSubmit = async (data: ProductFormValues) => {
    if (data.design?.at(0)?.title !== "" && data.design?.length !== 0) {
      const designStock = data.design!.reduce(
        (total, current) => total + current.stock,
        0
      );
      data.stock = designStock;
    }
    if (data.design?.at(0)?.title === "") {
      data.design = [];
    }
    if (data.style?.at(0)?.title === "") {
      data.style = [];
    }
    if (data.detail?.at(0)?.text === "") {
      data.detail = [];
    }
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/products/${params.productId}`, data);
      } else {
        await axios.post("/api/products", data);
      }
      router.refresh();
      router.push("/products");
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
      await axios.delete(`/api/products/${params.productId}`);
      router.refresh();
      router.push("/products");
      toast.success("Product deleted!");
    } catch (error) {
      toast.error(
        "Please make sure to remove all products associated with this product"
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const onCancel = () => {
    router.refresh();
    router.push("/products");
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
            className="space-y-8 w-5/12"
          >
            <div className="flex w-full justify-between">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="w-7/12">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Title"
                        disabled={loading}
                        {...field}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0.00"
                        disabled={loading}
                        {...field}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormDescription>
                    Provide a description of the item
                  </FormDescription>
                  <FormControl>
                    <Textarea
                      placeholder="Please enter a description"
                      {...field}
                      disabled={loading}
                      value={field.value}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div>
              Details
              <FormDescription>
                Please enter detail information here
              </FormDescription>
              {detailArray.fields.map((field, index) => (
                <div key={field.id} className="flex justify-between w-full">
                  <FormField
                    control={form.control}
                    name={`detail.${index}.text`}
                    render={({ field }) => (
                      <FormItem className="w-11/12">
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="" disabled={loading} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="mt-8"
                    type="button"
                    onClick={() => detailArray.remove(index)}
                  >
                    <Trash />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2 w-full"
                onClick={() => detailArray.append({ text: "" })}
              >
                Add New Detail
              </Button>
            </div>
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              Design
              <FormDescription>
                Please enter design information here
              </FormDescription>
              {designArray.fields.map((field, index) => (
                <div key={field.id} className="flex flex-auto justify-between">
                  <FormField
                    control={form.control}
                    name={`design.${index}.title`}
                    render={({ field }) => (
                      <FormItem className="w-2/3 mr-3">
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Title"
                            disabled={loading}
                            {...field}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`design.${index}.stock`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0.00"
                            disabled={loading}
                            {...field}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="mt-8 ml-2"
                    type="button"
                    onClick={() => designArray.remove(index)}
                  >
                    <Trash />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2 w-full"
                onClick={() => designArray.append({ title: "", stock: 0 })}
              >
                Add New Design
              </Button>
            </div>
            <div>
              Style
              <FormDescription>
                Please enter style information here
              </FormDescription>
              {styleArray.fields.map((field, index) => (
                <div key={field.id} className="flex justify-between w-full">
                  <FormField
                    control={form.control}
                    name={`style.${index}.title`}
                    render={({ field }) => (
                      <FormItem className="w-11/12">
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Title"
                            disabled={loading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="mt-8"
                    type="button"
                    onClick={() => styleArray.remove(index)}
                  >
                    <Trash />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2 w-full"
                onClick={() => styleArray.append({ title: "" })}
              >
                Add New Style
              </Button>
            </div>
            <div>
              <h2>Feature or Archive Product</h2>
              <FormDescription className="pb-2">
                Select whether to feature or archive this product
              </FormDescription>
              <div className="flex justify-between">
                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mr-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          // @ts-ignore
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Featured</FormLabel>
                        <FormDescription>
                          This product will appear on the homepage
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isArchived"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          // @ts-ignore
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Archived</FormLabel>
                        <FormDescription>
                          This product will be archived
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {!!form.watch(`design.${0}.title`) ? null : (
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormDescription>
                      Stock will be auto-caclulated if there are multiple
                      designs
                    </FormDescription>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="w-full justify-center items-center">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Images</FormLabel>
                    <FormDescription>
                      Upload images for this product
                    </FormDescription>
                    <FormControl>
                      <ImageUpload
                        value={field.value.map((image) => image.url)}
                        disabled={loading}
                        onChange={(url) =>
                          field.onChange([...field.value, { url }])
                        }
                        onRemove={(url) =>
                          field.onChange([
                            ...field.value.filter(
                              (current) => current.url !== url
                            ),
                          ])
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-between">
              <Button type="submit" className="w-full mr-2">
                {action}
              </Button>
              <Button
                type="button"
                className="w-full ml-2"
                variant="outline"
                onClick={onCancel}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </Form>
    </>
  );
};

export default ProductForm;
