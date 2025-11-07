"use client"

import { useState } from "react"
import { Search, Filter, Download, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

const users = [
  {
    name: "Emma Smith",
    email: "smith@kpmg.com",
    role: "Administrator",
    lastLogin: "Yesterday",
    twoStep: false,
    joined: "10 Nov 2025, 10:10 pm",
  },
  {
    name: "Melody Macy",
    email: "melody@altbox.com",
    role: "Analyst",
    lastLogin: "20 mins ago",
    twoStep: true,
    joined: "25 Jul 2025, 11:30 am",
  },
  {
    name: "Max Smith",
    email: "max@kt.com",
    role: "Developer",
    lastLogin: "3 days ago",
    twoStep: false,
    joined: "15 Apr 2025, 9:23 pm",
  },
  {
    name: "Sean Bean",
    email: "sean@dellito.com",
    role: "Support",
    lastLogin: "2 weeks ago",
    twoStep: false,
    joined: "21 Feb 2025, 5:20 pm",
  },
  {
    name: "Brian Cox",
    email: "brian@exchange.com",
    role: "Developer",
    lastLogin: "2 days ago",
    twoStep: true,
    joined: "25 Jul 2025, 6:43 am",
  },
  {
    name: "Mikaela Collins",
    email: "mik@pex.com",
    role: "Administrator",
    lastLogin: "5 days ago",
    twoStep: false,
    joined: "05 May 2025, 10:10 pm",
  },
  {
    name: "Francis Mitcham",
    email: "f.mit@kpmg.com",
    role: "Trial",
    lastLogin: "3 weeks ago",
    twoStep: false,
    joined: "10 Mar 2025, 5:30 pm",
  },
  {
    name: "Olivia Wild",
    email: "olivia@corpmail.com",
    role: "Administrator",
    lastLogin: "Yesterday",
    twoStep: false,
    joined: "20 Dec 2025, 8:43 pm",
  },
  {
    name: "Neil Owen",
    email: "owen.neil@gmail.com",
    role: "Analyst",
    lastLogin: "20 mins ago",
    twoStep: true,
    joined: "15 Apr 2025, 6:05 pm",
  },
  {
    name: "Dan Wilson",
    email: "dam@consilting.com",
    role: "Developer",
    lastLogin: "3 days ago",
    twoStep: false,
    joined: "20 Dec 2025, 5:20 pm",
  },
]

export default function UsersPage() {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
            <span>Home</span>
            <span>-</span>
            <span>User Management</span>
            <span>-</span>
            <span>Users</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Users List</h1>
        </div>

        {/* Actions Bar */}
        <div className="mb-6 flex items-center justify-between">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input placeholder="Search user" className="pl-10 border-gray-300" />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2 bg-white border-gray-300">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" className="gap-2 bg-white border-gray-300">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-[#009ef7] text-white hover:bg-[#0086d6]">
                  <Plus className="h-4 w-4" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">Add User</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  {/* Avatar */}
                  <div>
                    <Label className="mb-3 block text-base font-semibold">Avatar</Label>
                    <div className="flex items-center gap-4">
                      <div className="relative h-32 w-32 overflow-hidden rounded-lg">
                        <Image
                          src="/diverse-avatars.png"
                          alt="Avatar"
                          width={128}
                          height={128}
                          className="h-full w-full object-cover"
                        />
                        <button className="absolute right-2 top-2 rounded-full bg-white p-1 shadow-sm">
                          <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                        <button className="absolute bottom-2 right-2 rounded-full bg-white p-1 shadow-sm">
                          <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">Allowed file types: png, jpg, jpeg.</p>
                  </div>

                  {/* Full Name */}
                  <div>
                    <Label htmlFor="fullName" className="mb-2 block">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input id="fullName" defaultValue="Emma Smith" className="bg-gray-50 border-gray-300" />
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="email" className="mb-2 block">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="smith@kpmg.com"
                      className="bg-gray-50 border-gray-300"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      variant="outline"
                      className="border-gray-300 bg-transparent"
                      onClick={() => setIsAddUserOpen(false)}
                    >
                      Discard
                    </Button>
                    <Button className="bg-[#009ef7] text-white hover:bg-[#0086d6]">Submit</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-4 text-left">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase text-gray-500">User</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase text-gray-500">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase text-gray-500">Last Login</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase text-gray-500">Two-Step</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase text-gray-500">Joined Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#009ef7] text-white">
                          <span className="text-sm font-medium">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{user.role}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{user.lastLogin}</td>
                    <td className="px-6 py-4">
                      {user.twoStep && <Badge className="bg-[#50cd89] text-white hover:bg-[#47b881]">Enabled</Badge>}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{user.joined}</td>
                    <td className="px-6 py-4">
                      <Button variant="ghost" size="sm" className="gap-2 text-gray-700 hover:text-[#009ef7]">
                        Actions
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
            <Button variant="ghost" size="sm" className="text-gray-700">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
            <div className="flex gap-2">
              <Button size="sm" className="bg-[#009ef7] text-white hover:bg-[#0086d6]">
                1
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-700">
                2
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-700">
                3
              </Button>
            </div>
            <Button variant="ghost" size="sm" className="text-gray-700">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
