"use client"
import { Upload } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AddCategoryPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <span>-</span>
            <Link href="/catalog" className="hover:text-primary">
              eCommerce
            </Link>
            <span>-</span>
            <span>Catalog</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Add Category</h1>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 bg-transparent">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filter
          </Button>
          <Button className="bg-[#009ef7] hover:bg-[#0077b6]">Create</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar */}
        <div className="space-y-6">
          {/* Thumbnail */}
          <Card className="p-6 bg-white shadow-sm">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Thumbnail</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#009ef7] transition-colors cursor-pointer">
              <div className="flex flex-col items-center gap-3">
                <div className="h-20 w-20 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <Upload className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">
              Set the category thumbnail image. Only *.png, *.jpg and *.jpeg image files are accepted
            </p>
          </Card>

          {/* Status */}
          <Card className="p-6 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900">Status</h3>
              <div className="h-2 w-2 rounded-full bg-[#50cd89]"></div>
            </div>
            <Select defaultValue="published">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-2">Set the category status.</p>
          </Card>

          {/* Store Template */}
          <Card className="p-6 bg-white shadow-sm">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Store Template</h3>
            <Label className="text-sm text-gray-700 mb-2 block">Select a store template</Label>
            <Select defaultValue="default">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default template</SelectItem>
                <SelectItem value="modern">Modern template</SelectItem>
                <SelectItem value="classic">Classic template</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-2">
              Assign a template from your current theme to define how the category products are displayed.
            </p>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* General */}
          <Card className="p-6 bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">General</h3>

            <div className="space-y-6">
              <div>
                <Label htmlFor="categoryName" className="text-sm font-medium text-gray-700 mb-2 block">
                  Category Name <span className="text-[#f1416c]">*</span>
                </Label>
                <Input id="categoryName" placeholder="Product name" className="w-full" />
                <p className="text-xs text-gray-500 mt-2">A category name is required and recommended to be unique.</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Description</Label>
                <div className="border border-gray-300 rounded-lg">
                  <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200 bg-gray-50">
                    <Select defaultValue="normal">
                      <SelectTrigger className="w-32 h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="heading1">Heading 1</SelectItem>
                        <SelectItem value="heading2">Heading 2</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <span className="font-bold">B</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <span className="italic">I</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <span className="underline">U</span>
                      </Button>
                    </div>
                    <div className="flex gap-1 ml-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                          />
                        </svg>
                      </Button>
                    </div>
                  </div>
                  <textarea
                    className="w-full p-3 min-h-[120px] focus:outline-none"
                    placeholder="Type your text here..."
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">Set a description to the category for better visibility.</p>
              </div>
            </div>
          </Card>

          {/* Meta Options */}
          <Card className="p-6 bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Meta Options</h3>

            <div className="space-y-6">
              <div>
                <Label htmlFor="metaTitle" className="text-sm font-medium text-gray-700 mb-2 block">
                  Meta Tag Title
                </Label>
                <Input id="metaTitle" placeholder="Meta tag name" className="w-full" />
                <p className="text-xs text-gray-500 mt-2">
                  Set a meta tag title. Recommended to be simple and precise keywords.
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Meta Tag Description</Label>
                <div className="border border-gray-300 rounded-lg">
                  <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200 bg-gray-50">
                    <Select defaultValue="normal">
                      <SelectTrigger className="w-32 h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="heading1">Heading 1</SelectItem>
                        <SelectItem value="heading2">Heading 2</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <span className="font-bold">B</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <span className="italic">I</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <span className="underline">U</span>
                      </Button>
                    </div>
                    <div className="flex gap-1 ml-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                          />
                        </svg>
                      </Button>
                    </div>
                  </div>
                  <textarea
                    className="w-full p-3 min-h-[120px] focus:outline-none"
                    placeholder="Type your text here..."
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Set a meta tag description to the category for increased SEO ranking.
                </p>
              </div>

              <div>
                <Label htmlFor="metaKeywords" className="text-sm font-medium text-gray-700 mb-2 block">
                  Meta Tag Keywords
                </Label>
                <Input id="metaKeywords" className="w-full" />
                <p className="text-xs text-gray-500 mt-2">
                  Set a list of keywords that the category is related to. Separate the keywords by adding a comma{" "}
                  <span className="font-mono">,</span> between each keyword.
                </p>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline">Cancel</Button>
            <Button className="bg-[#009ef7] hover:bg-[#0077b6]">Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
