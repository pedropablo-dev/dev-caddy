"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import Image from "next/image" // <-- IMPORTANTE: Añadimos la importación de Image
import {
  Search,
  Copy,
  Check,
  Play,
  Terminal,
  Settings,
  HelpCircle,
  PanelLeftClose,
  Sparkles,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import ReactMarkdown, { Components } from "react-markdown"
import { useUIStore } from "@/store/uiStore"
import { useAppStore } from "@/store/appStore"

// --- Tipos de Datos ---
interface Command {
  id: string
  label: string
  command: string
  type: "command" | "workflow" | "prompt"
  isFavorite?: boolean
  variables?: { name: string; placeholder: string }[]
  steps?: string[]
  order?: number
}

interface Category {
  id: string
  name: string
  icon: string
  order?: number
}

interface AppData {
  categories: Category[]
  commands: Record<string, Command[]>
}

const markdownComponents: Components = {
    h1: ({...props}) => <h1 className="text-2xl font-bold text-white mb-4" {...props} />,
    h3: ({...props}) => <h3 className="text-lg font-semibold text-blue-400 mt-6 mb-2" {...props} />,
    hr: ({...props}) => <hr className="my-4 border-gray-700" {...props} />,
    ul: ({...props}) => <ul className="list-disc list-inside space-y-2 pl-4" {...props} />,
    li: ({...props}) => <li className="text-gray-300" {...props} />,
    p: ({...props}) => <p className="text-gray-300 mb-4" {...props} />,
    strong: ({...props}) => <strong className="font-semibold text-gray-200" {...props} />,
    code: ({...props}) => <code className="bg-gray-800 text-purple-300 font-mono rounded-md px-1.5 py-0.5 text-sm" {...props} />
}

export default function BroworksLaunchpad() {
  // --- Estados de Datos y UI Principal ---
  const [data, setData] = useState<AppData>({ categories: [], commands: {} })
  const [isLoading, setIsLoading] = useState(true)
  const { selectedCategory, setSelectedCategory } = useAppStore() // <-- USANDO EL STORE
  const [searchQuery, setSearchQuery] = useState("")
  const [categorySearch, setCategorySearch] = useState("")
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null)
  const [variableValues, setVariableValues] = useState<Record<string, string>>({})
  const [workflowStep, setWorkflowStep] = useState<Record<string, number>>({})
  const [hasMounted, setHasMounted] = useState(false);

  const { isSidebarCollapsed, toggleSidebar } = useUIStore()
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [helpContent, setHelpContent] = useState("")

  // --- Lógica de Datos (Carga) ---
  const fetchData = async () => {
    if (!isLoading) setIsLoading(true)
    try {
      const response = await fetch("/api/commands")
      if (!response.ok) throw new Error(`API call failed with status: ${response.status}`)

      const jsonData: AppData = await response.json()

      let needsSave = false;
      jsonData.categories.forEach((cat, index) => {
        if (cat.order === undefined) {
          cat.order = index;
          needsSave = true;
        }
      });

      for (const categoryId in jsonData.commands) {
        jsonData.commands[categoryId].forEach((cmd, index) => {
          if (cmd.order === undefined) {
            cmd.order = index;
            needsSave = true;
          }
        });
      }

      setData(jsonData)

      // Se mantiene la categoría seleccionada del store, no se resetea
      if (needsSave) {
        await saveData(jsonData, false);
      }

    } catch (error) {
      console.error("Error loading commands:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveData = async (newData: AppData, shouldRefetch = true) => {
    try {
      await fetch("/api/commands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });
      if (shouldRefetch) {
        // No se llama a fetchData para evitar bucles. 
        // El estado se actualiza localmente en las funciones que guardan.
        setData(newData);
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Error al guardar los datos.");
    }
  };

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // --- Lógica de Ayuda ---
  useEffect(() => {
    if (isHelpOpen) {
      fetch("/help.md")
        .then((r) => r.text())
        .then(setHelpContent)
        .catch(() => setHelpContent("No se pudo cargar la ayuda."))
    }
  }, [isHelpOpen])

  // --- Lógica de Favoritos ---
  const handleToggleFavorite = (commandId: string) => {
    const newData = JSON.parse(JSON.stringify(data));
    let found = false;

    for (const categoryId in newData.commands) {
      const commandIndex = newData.commands[categoryId].findIndex((cmd: Command) => cmd.id === commandId);
      if (commandIndex !== -1) {
        const currentStatus = newData.commands[categoryId][commandIndex].isFavorite || false;
        newData.commands[categoryId][commandIndex].isFavorite = !currentStatus;
        found = true;
        break;
      }
    }

    if (found) {
      setData(newData); // Actualización local inmediata
      saveData(newData, false); // Guardar sin recargar
    }
  };

  // --- Lógica de Categorías y Comandos para Mostrar ---
  const displayCategories = useMemo(() => {
    const favoritesCategory = { id: 'favorites', name: 'Favoritos', icon: '⭐', order: -1 };
    const sortedCategories = [...data.categories].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return [favoritesCategory, ...sortedCategories];
  }, [data.categories]);

  const filteredCategories = useMemo(() => {
    return displayCategories.filter((cat) =>
      cat.name.toLowerCase().includes(categorySearch.toLowerCase())
    );
  }, [displayCategories, categorySearch]);

  const filteredCommands = useMemo(() => {
    let commandsToShow: Command[] = [];

    if (selectedCategory === 'favorites') {
      commandsToShow = Object.values(data.commands)
        .flat()
        .filter(cmd => cmd.isFavorite)
        .sort((a,b) => (a.label > b.label) ? 1 : -1); // Ordenar favoritos alfabéticamente
    } else {
      commandsToShow = [...(data.commands[selectedCategory] || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }

    if (searchQuery) {
      return commandsToShow.filter(
        (cmd) =>
          cmd.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cmd.command.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return commandsToShow;
  }, [selectedCategory, data.commands, searchQuery]);


  // --- Lógica de Interacción con Comandos ---
  const handleCopyCommand = (commandId: string, baseCommand: string, variables?: any[]) => {
    let finalCommand = baseCommand
    if (variables) {
      variables.forEach((variable) => {
        const value = variableValues[`${commandId}_${variable.name}`] || ""
        finalCommand = finalCommand.replace(`{${variable.name}}`, value)
      })
    }
    navigator.clipboard.writeText(finalCommand)
    setCopiedCommand(commandId)
    setTimeout(() => setCopiedCommand(null), 2000)
  }

  const handleWorkflowStep = (commandId: string, steps: string[]) => {
    const currentStep = workflowStep[commandId] || 0
    const nextStep = (currentStep + 1) % steps.length
    handleCopyCommand(commandId + "_step_" + currentStep, steps[currentStep])
    setWorkflowStep((prev) => ({ ...prev, [commandId]: nextStep }))
  }

  // --- Atajo de Teclado ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        document.getElementById("command-search")?.focus()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const sidebarClasses = hasMounted && isSidebarCollapsed ? "w-20" : "w-80";
  const contentClasses = hasMounted && isSidebarCollapsed ? "hidden" : "";

  if (isLoading || !hasMounted) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Dev-Caddy Logo" width={32} height={32} className="flex-shrink-0"/>
          <h1 className="text-2xl font-bold text-yellow-500">Loading Dev-Caddy...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-7xl mx-auto flex h-screen">
        {/* Left Panel */}
        <div className={`transition-all duration-300 ${sidebarClasses} bg-gray-900 border-r border-gray-800 flex flex-col`}>
          <div className="p-4 border-b border-gray-800">
            <div className={`flex items-center gap-3 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
              {/* --- INICIO DE LA MODIFICACIÓN --- */}
              <Image
                  src="/logo.png"
                  alt="Dev-Caddy Logo"
                  width={32}
                  height={32}
                  className="flex-shrink-0"
                />
              <h1 className={`text-xl font-bold bg-gradient-to-r from-yellow-500 to-orange-300 bg-clip-text text-transparent whitespace-nowrap ${contentClasses}`}>
                broWorks Dev-Caddy
              </h1>
               {/* --- FIN DE LA MODIFICACIÓN --- */}
            </div>

            <div className={`flex items-center mt-3 mb-4 gap-2 ${isSidebarCollapsed ? 'justify-center' : 'justify-start'}`}>
                <Link href="/admin" className="w-full">
                    <Button variant="ghost" className={`w-full gap-2 text-gray-400 hover:bg-gray-800/50 hover:text-gray-200 px-2 ${isSidebarCollapsed ? 'justify-center' : 'justify-start'}`}>
                        <Settings className="h-5 w-5 flex-shrink-0" />
                        <span className={`font-bold text-sm ${contentClasses}`}>Panel de Administración</span>
                    </Button>
                </Link>
            </div>

            {!isSidebarCollapsed && (
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar categorías..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 focus:border-blue-500"
                />
              </div>
            )}
          </div>

          <ScrollArea className="flex-1 p-2">
             {!isSidebarCollapsed && (
                <h3 className="text-sm font-bold text-gray-400 mb-3 px-3">
                    Categorías
                </h3>
             )}
            <div className="space-y-1">
              {filteredCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)} // <-- USA EL STORE
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    selectedCategory === category.id
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                >
                  <span className="text-lg">{category.icon}</span>
                  <span
                    className={`font-medium whitespace-nowrap ${contentClasses}`}
                  >
                    {category.name}
                  </span>
                </button>
              ))}
            </div>
          </ScrollArea>

          <div className="p-2 border-t border-gray-800 flex flex-col gap-2">
            <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className={`gap-2 text-gray-400 hover:bg-gray-800/50 hover:text-gray-200 px-2 ${isSidebarCollapsed ? 'justify-center' : 'justify-start'}`}
                >
                  <HelpCircle className="h-5 w-5 flex-shrink-0" />
                  <span
                    className={`font-bold text-sm ${contentClasses}`}
                  >
                    Ayuda
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl h-[80vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <HelpCircle /> Guía de uso
                  </DialogTitle>
                </DialogHeader>
                <ScrollArea className="flex-1 pr-4">
                  <div className="prose prose-invert max-w-none w-full">
                    <ReactMarkdown components={markdownComponents}>
                        {helpContent}
                    </ReactMarkdown>
                  </div>
                </ScrollArea>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      type="button"
                      className="bg-gray-700 text-white hover:bg-gray-600"
                    >
                      Entendido
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button
              variant="ghost"
              onClick={toggleSidebar}
              className={`gap-2 text-gray-400 hover:bg-gray-800/50 hover:text-gray-200 px-2 ${isSidebarCollapsed ? 'justify-center' : 'justify-start'}`}
            >
              <PanelLeftClose className="h-5 w-5 flex-shrink-0" />
              <span
                className={`font-bold text-sm ${contentClasses}`}
              >
                Colapsar
              </span>
            </Button>
          </div>
        </div>

        {/* Central Panel */}
        <div className="flex-1 flex flex-col bg-gray-950">
          <div className="p-6 border-b border-gray-800">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="command-search"
                placeholder="Buscar items o presionar Ctrl+K..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-gray-900 border-gray-700 focus:border-blue-500 text-lg"
              />
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-6 space-y-4">
              {filteredCommands.map((cmd) => (
                <Card
                  key={cmd.id}
                  className="bg-gray-900 border-gray-800"
                >
                  <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-yellow-400" onClick={() => handleToggleFavorite(cmd.id)}>
                            <Star className={`transition-all ${cmd.isFavorite ? 'text-yellow-400 fill-yellow-400' : ''}`} />
                        </Button>
                        <CardTitle className="text-lg font-semibold text-gray-100 flex items-center gap-2">
                        {cmd.type === "workflow" ? (<Play className="w-4 h-4 text-purple-400" />) : cmd.type === 'prompt' ? (<Sparkles className="w-4 h-4 text-yellow-400" />) : (<Terminal className="w-4 h-4 text-blue-400" />)}
                        {cmd.label}
                        </CardTitle>
                    </div>
                    <div>
                        {cmd.type === 'prompt' && (<Badge variant="secondary" className="bg-yellow-900 text-yellow-200 hover:bg-yellow-900/80">Prompt</Badge>)}
                        {cmd.type === "command" && (!cmd.variables || cmd.variables.length === 0) && (
                        <Button size="sm" onClick={() => handleCopyCommand(cmd.id, cmd.command)} className="bg-blue-600 hover:bg-blue-700">
                            {copiedCommand === cmd.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            <span className="ml-2">Copy</span>
                        </Button>
                        )}
                        {cmd.type === "command" && cmd.variables && cmd.variables.length > 0 && (<Badge variant="secondary" className="bg-green-900 text-green-200 hover:bg-green-900/80">Con Variables</Badge>)}
                        {cmd.type === "workflow" && (<Badge variant="secondary" className="bg-purple-900 text-purple-200 hover:bg-purple-900/80">Workflow</Badge>)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-2">
                    {cmd.type === 'prompt' ? (
                        <>
                            <Textarea value={cmd.command} readOnly className="font-sans bg-gray-800 border-gray-700 text-white text-sm" rows={Math.min(10, cmd.command.split('\n').length)} />
                            <Button size="sm" onClick={() => handleCopyCommand(cmd.id, cmd.command)} className="bg-yellow-600 hover:bg-yellow-700">
                                {copiedCommand === cmd.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                <span className="ml-2">Copy Prompt</span>
                            </Button>
                        </>
                    ) : cmd.type === "workflow" ? (
                      <div className="space-y-3">
                        <div className="text-sm text-gray-400">Step {(workflowStep[cmd.id] || 0) + 1} of{" "}{cmd.steps?.length}</div>
                        <Input value={cmd.steps?.[workflowStep[cmd.id] || 0] || ""} readOnly className="font-mono bg-gray-800 border-gray-700 text-white" />
                        <Button onClick={() => handleWorkflowStep(cmd.id, cmd.steps || [])} className="bg-purple-600 hover:bg-purple-700">
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Step & Next
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Input value={cmd.command} readOnly className="font-mono bg-gray-800 border-gray-700 text-white" />
                        {cmd.variables && (
                          <div className="grid gap-2 mt-4">
                            {cmd.variables.map((variable) => (
                              <Input key={variable.name} placeholder={variable.placeholder} value={variableValues[`${cmd.id}_${variable.name}`] || ""}
                                onChange={(e) =>
                                  setVariableValues((prev) => ({...prev, [`${cmd.id}_${variable.name}`]: e.target.value,}))
                                }
                                className="bg-gray-800 border-gray-700 focus:border-blue-500 text-white" />
                            ))}
                               <Button size="sm" onClick={() => handleCopyCommand(cmd.id, cmd.command, cmd.variables)} className="bg-green-600 hover:bg-green-700 w-fit">
                                  {copiedCommand === cmd.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                  <span className="ml-2">Copy</span>
                                </Button>
                            </div>
                          )}
                        </>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
        </div>
      </div>
    </div>
  )
}