"use client"

import { Sidebar } from "@/components/layouts/sidebar"
import { Header } from "@/components/layouts/header"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, X } from "lucide-react"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"

export default function AddProductPage() {
  const [images, setImages] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("general")

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="pl-64">
        <Header />
        <main className="pt-16">
          <div className="p-6">
            <PageHeader
              title="Product Form"
              breadcrumbs={[{ label: "Home", href: "/" }, { label: "eCommerce" }, { label: "Catalog" }]}
              actions={
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
              }
            />

            <div className="grid gap-6 lg:grid-cols-4">
              {/* Left Sidebar */}
              <div className="space-y-6">
                {/* Thumbnail */}
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold text-gray-900">Thumbnail</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#009ef7] transition-colors cursor-pointer">
                      <div className="flex flex-col items-center gap-3">
                        <div className="h-20 w-20 bg-gray-100 rounded-lg flex items-center justify-center">
                          <svg
                            className="h-10 w-10 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
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
                      Set the product thumbnail image. Only *.png, *.jpg and *.jpeg image files are accepted
                    </p>
                  </CardContent>
                </Card>

                {/* Status */}
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold text-gray-900">Status</CardTitle>
                      <div className="h-2 w-2 rounded-full bg-[#50cd89]"></div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Select defaultValue="published">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-2">Set the product status.</p>
                  </CardContent>
                </Card>

                {/* Product Details */}
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold text-gray-900">Product Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">Categories</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="electronics">Electronics</SelectItem>
                          <SelectItem value="clothing">Clothing</SelectItem>
                          <SelectItem value="accessories">Accessories</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500 mt-2">Add product to a category.</p>
                      <Button variant="link" className="text-[#009ef7] p-0 h-auto mt-2 text-sm">
                        + Create new category
                      </Button>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">Tags</Label>
                      <Input placeholder="" />
                      <p className="text-xs text-gray-500 mt-2">Add tags to a product.</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Weekly Sales */}
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold text-gray-900">Weekly Sales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">
                      No data available. Sales data will begin capturing once product has been published.
                    </p>
                  </CardContent>
                </Card>

                {/* Product Template */}
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold text-gray-900">Product Template</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Select a product template</Label>
                    <Select defaultValue="default">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default template</SelectItem>
                        <SelectItem value="modern">Modern template</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-2">
                      Assign a template from your current theme to define how a single product is displayed.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content with Tabs */}
              <div className="lg:col-span-3">
                {/* Tabs for General and Advanced */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="bg-white border-b border-gray-200 rounded-none h-auto p-0 mb-6">
                    <TabsTrigger
                      value="general"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#009ef7] data-[state=active]:text-[#009ef7] px-6 py-3"
                    >
                      General
                    </TabsTrigger>
                    <TabsTrigger
                      value="advanced"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#009ef7] data-[state=active]:text-[#009ef7] px-6 py-3"
                    >
                      Advanced
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="general" className="space-y-6">
                    {/* General Section */}
                    <Card className="bg-white shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-900">General</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <Label htmlFor="productName" className="text-sm font-medium text-gray-700 mb-2 block">
                            Product Name <span className="text-[#f1416c]">*</span>
                          </Label>
                          <Input id="productName" placeholder="Product name" />
                          <p className="text-xs text-gray-500 mt-2">
                            A product name is required and recommended to be unique.
                          </p>
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
                            </div>
                            <textarea
                              className="w-full p-3 min-h-[120px] focus:outline-none"
                              placeholder="Type your text here..."
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Set a description to the product for better visibility.
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Media */}
                    <Card className="bg-white shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-900">Media</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-[#009ef7] transition-colors cursor-pointer">
                          <div className="flex flex-col items-center gap-3">
                            <div className="h-16 w-16 rounded-full bg-[#e1f0ff] flex items-center justify-center">
                              <Upload className="h-8 w-8 text-[#009ef7]" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">Drop files here or click to upload.</p>
                              <p className="text-xs text-gray-500 mt-1">Upload up to 10 files</p>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-3">Set the product media gallery.</p>
                      </CardContent>
                    </Card>

                    {/* Pricing */}
                    <Card className="bg-white shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-900">Pricing</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <Label htmlFor="basePrice" className="text-sm font-medium text-gray-700 mb-2 block">
                            Base Price <span className="text-[#f1416c]">*</span>
                          </Label>
                          <Input id="basePrice" placeholder="Product price" />
                          <p className="text-xs text-gray-500 mt-2">Set the product price.</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">
                            Discount Type{" "}
                            <svg
                              className="inline h-4 w-4 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </Label>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="border border-gray-300 rounded-lg p-4 cursor-pointer hover:border-[#009ef7] bg-[#e1f0ff] border-[#009ef7]">
                              <div className="flex items-center gap-2">
                                <div className="h-4 w-4 rounded-full border-2 border-[#009ef7] flex items-center justify-center">
                                  <div className="h-2 w-2 rounded-full bg-[#009ef7]"></div>
                                </div>
                                <span className="text-sm font-medium text-gray-900">No Discount</span>
                              </div>
                            </div>
                            <div className="border border-gray-300 rounded-lg p-4 cursor-pointer hover:border-[#009ef7]">
                              <div className="flex items-center gap-2">
                                <div className="h-4 w-4 rounded-full border-2 border-gray-300"></div>
                                <span className="text-sm font-medium text-gray-900">Percentage %</span>
                              </div>
                            </div>
                            <div className="border border-gray-300 rounded-lg p-4 cursor-pointer hover:border-[#009ef7]">
                              <div className="flex items-center gap-2">
                                <div className="h-4 w-4 rounded-full border-2 border-gray-300"></div>
                                <span className="text-sm font-medium text-gray-900">Fixed Price</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <Label htmlFor="taxClass" className="text-sm font-medium text-gray-700 mb-2 block">
                              Tax Class <span className="text-[#f1416c]">*</span>
                            </Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an option" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="standard">Standard</SelectItem>
                                <SelectItem value="reduced">Reduced</SelectItem>
                              </SelectContent>
                            </Select>
                            <p className="text-xs text-gray-500 mt-2">Set the product tax class.</p>
                          </div>
                          <div>
                            <Label htmlFor="vat" className="text-sm font-medium text-gray-700 mb-2 block">
                              VAT Amount (%)
                            </Label>
                            <Input id="vat" placeholder="0" />
                            <p className="text-xs text-gray-500 mt-2">Set the product VAT about.</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3">
                      <Button variant="outline">Cancel</Button>
                      <Button className="bg-[#009ef7] hover:bg-[#0077b6]">Save Changes</Button>
                    </div>
                  </TabsContent>

                  {/* Advanced tab content */}
                  <TabsContent value="advanced" className="space-y-6">
                    {/* Inventory */}
                    <Card className="bg-white shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-900">Inventory</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <Label htmlFor="sku" className="text-sm font-medium text-gray-700 mb-2 block">
                            SKU <span className="text-[#f1416c]">*</span>
                          </Label>
                          <Input id="sku" placeholder="SKU Number" />
                          <p className="text-xs text-gray-500 mt-2">Enter the product SKU.</p>
                        </div>
                        <div>
                          <Label htmlFor="barcode" className="text-sm font-medium text-gray-700 mb-2 block">
                            Barcode <span className="text-[#f1416c]">*</span>
                          </Label>
                          <Input id="barcode" placeholder="Barcode Number" />
                          <p className="text-xs text-gray-500 mt-2">Enter the product barcode number.</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">
                            Quantity <span className="text-[#f1416c]">*</span>
                          </Label>
                          <div className="grid gap-4 md:grid-cols-2">
                            <Input placeholder="On shelf" />
                            <Input placeholder="In warehouse" />
                          </div>
                          <p className="text-xs text-gray-500 mt-2">Enter the product quantity.</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">Allow Backorders</Label>
                          <div className="flex items-center gap-2">
                            <Checkbox id="backorders" />
                            <Label htmlFor="backorders" className="text-sm text-gray-700 cursor-pointer">
                              Yes
                            </Label>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Allow customers to purchase products that are out of stock.
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Variations */}
                    <Card className="bg-white shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-900">Variations</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">Add Product Variations</Label>
                          <div className="flex gap-3">
                            <Select>
                              <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Select a variation" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="size">Size</SelectItem>
                                <SelectItem value="color">Color</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input placeholder="Variation" className="flex-1" />
                            <Button variant="ghost" size="icon" className="text-red-600">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button variant="link" className="text-[#009ef7] p-0 h-auto mt-3 text-sm">
                            + Add another variation
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Shipping */}
                    <Card className="bg-white shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-900">Shipping</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2">
                          <Checkbox id="physical" />
                          <Label htmlFor="physical" className="text-sm text-gray-700 cursor-pointer">
                            This is a physical product
                          </Label>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Set if the product is a physical or digital item. Physical products may require shipping.
                        </p>
                      </CardContent>
                    </Card>

                    {/* Meta Options */}
                    <Card className="bg-white shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-900">Meta Options</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <Label htmlFor="metaTitle" className="text-sm font-medium text-gray-700 mb-2 block">
                            Meta tag name
                          </Label>
                          <Input id="metaTitle" />
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
                            </div>
                            <textarea
                              className="w-full p-3 min-h-[120px] focus:outline-none"
                              placeholder="Type your text here..."
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Set a meta tag description to the product for increased SEO ranking.
                          </p>
                        </div>
                        <div>
                          <Label htmlFor="metaKeywords" className="text-sm font-medium text-gray-700 mb-2 block">
                            Meta Tag Keywords
                          </Label>
                          <Input id="metaKeywords" />
                          <p className="text-xs text-gray-500 mt-2">
                            Set a list of keywords that the product is related to. Separate the keywords by adding a
                            comma <span className="font-mono">,</span> between each keyword.
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3">
                      <Button variant="outline">Cancel</Button>
                      <Button className="bg-[#009ef7] hover:bg-[#0077b6]">Save Changes</Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
