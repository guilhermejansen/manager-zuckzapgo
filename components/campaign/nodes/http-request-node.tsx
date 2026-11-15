"use client"

import { memo, useCallback, useRef } from "react"

import { Webhook } from "lucide-react"
import type { NodeProps } from "reactflow"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import type { HttpRequestNodeConfig } from "@/lib/workflow/definitions"

import { InputMapper } from "../input-mapper"
import { PlaceholderMenu } from "../placeholder-menu"
import { BaseNode, type BaseNodeData } from "./base-node"

type KeyValuePair = HttpRequestNodeConfig["headers"][number] & { id: string }

export interface HttpRequestNodeData extends Omit<BaseNodeData, "content"> {
  config: HttpRequestNodeConfig
  onConfigChange?: (config: Partial<HttpRequestNodeConfig>) => void
}

function HttpRequestNode(props: NodeProps<HttpRequestNodeData>) {
  const { data, id } = props
  const { config } = data
  const urlRef = useRef<HTMLInputElement>(null)
  const bodyRef = useRef<HTMLTextAreaElement>(null)
  const rowSequence = useRef(0)

  const insertIntoControl = useCallback(
    (
      placeholder: string,
      element: HTMLInputElement | HTMLTextAreaElement | null,
      current: string,
      key: keyof HttpRequestNodeConfig
    ) => {
      if (data.readOnly) return
      if (!element) {
        data.onConfigChange?.({
          [key]: `${current ?? ""}${placeholder}`,
        } as Partial<HttpRequestNodeConfig>)
        return
      }

      const selectionStart = element.selectionStart ?? current.length
      const selectionEnd = element.selectionEnd ?? current.length
      const nextValue = current.slice(0, selectionStart) + placeholder + current.slice(selectionEnd)

      data.onConfigChange?.({ [key]: nextValue } as Partial<HttpRequestNodeConfig>)

      requestAnimationFrame(() => {
        const cursor = selectionStart + placeholder.length
        element.focus()
        element.setSelectionRange(cursor, cursor)
      })
    },
    [data]
  )

  const appendToPair = (
    key: "queryParams" | "headers",
    rowId: string,
    patch: Partial<KeyValuePair>
  ) => {
    const list = config[key].map((row) => (row.id === rowId ? { ...row, ...patch } : row))
    data.onConfigChange?.({ [key]: list } as Partial<HttpRequestNodeConfig>)
  }

  const updateKeyValueList = (
    key: "queryParams" | "headers",
    list: HttpRequestNodeConfig["headers"]
  ) => {
    data.onConfigChange?.({ [key]: list } as Partial<HttpRequestNodeConfig>)
  }

  const handleAddRow = (key: "queryParams" | "headers") => {
    if (data.readOnly) return
    const list = config[key]
    // Allocate only in the event, and skip persisted IDs after a remount.
    const existingIds = new Set([...config.headers, ...config.queryParams].map((row) => row.id))
    let rowId: string
    do {
      rowSequence.current += 1
      rowId = `${id}-${key}-${rowSequence.current}`
    } while (existingIds.has(rowId))
    updateKeyValueList(key, [
      ...list,
      {
        id: rowId,
        name: "",
        value: "",
        enabled: true,
      },
    ])
  }

  const handleRemoveRow = (key: "queryParams" | "headers", rowId: string) => {
    updateKeyValueList(
      key,
      config[key].filter((row) => row.id !== rowId)
    )
  }

  const handleInsertUrlPlaceholder = useCallback(
    (placeholder: string) => {
      insertIntoControl(placeholder, urlRef.current, config.url ?? "", "url")
    },
    [config.url, insertIntoControl]
  )

  const handleInsertBodyPlaceholder = useCallback(
    (placeholder: string) => {
      insertIntoControl(placeholder, bodyRef.current, config.body ?? "", "body")
    },
    [config.body, insertIntoControl]
  )

  const shouldShowInputMapper =
    (data.availableSources?.length ?? 0) > 0 || (data.inputs?.length ?? 0) > 0

  return (
    <BaseNode
      {...props}
      data={{
        ...data,
        label: "HTTP Request",
        description: "Chamada HTTP externa",
        icon: Webhook,
        theme: {
          border: "from-indigo-400 to-indigo-600",
          background: "bg-gradient-to-br from-indigo-900/40 to-indigo-800/30",
          accent: "bg-indigo-500/30",
        },
        allowInput: true,
        allowOutput: true,
        content: (
          <div className="space-y-4 text-xs text-card-foreground">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor={`${id}-method`} className="text-card-foreground">
                  Method
                </Label>
                <select
                  id={`${id}-method`}
                  value={config.method}
                  onChange={(event) => data.onConfigChange?.({ method: event.target.value })}
                  className="h-10 w-full rounded-md border border-border bg-secondary/50 px-3 text-foreground"
                  disabled={data.readOnly}
                >
                  {["GET", "POST", "PUT", "PATCH", "DELETE"].map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label htmlFor={`${id}-auth`} className="text-card-foreground">
                  Authentication
                </Label>
                <select
                  id={`${id}-auth`}
                  value={config.auth}
                  onChange={(event) =>
                    data.onConfigChange?.({
                      auth: event.target.value as HttpRequestNodeConfig["auth"],
                    })
                  }
                  className="h-10 w-full rounded-md border border-border bg-secondary/50 px-3 text-foreground"
                  disabled={data.readOnly}
                >
                  <option value="none">None</option>
                  <option value="basic">Basic</option>
                  <option value="bearer">Bearer</option>
                  <option value="apiKey">API Key</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor={`${id}-url`} className="text-card-foreground">
                  URL
                </Label>
                <PlaceholderMenu
                  groups={data.placeholders ?? []}
                  onInsert={handleInsertUrlPlaceholder}
                  disabled={data.readOnly}
                  triggerLabel="Variáveis"
                />
              </div>
              <Input
                ref={urlRef}
                id={`${id}-url`}
                value={config.url}
                onChange={(event) => data.onConfigChange?.({ url: event.target.value })}
                placeholder="https://api.example.com/resource"
                className="bg-secondary/50 text-foreground placeholder:text-muted-foreground"
                disabled={data.readOnly}
              />
            </div>

            {(["queryParams", "headers"] as const).map((sectionKey) => {
              const list = config[sectionKey]
              const sectionLabel = sectionKey === "queryParams" ? "Query parameters" : "Headers"
              return (
                <div key={sectionKey} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-card-foreground">{sectionLabel}</div>
                      <div className="text-xs text-muted-foreground">
                        Define custom {sectionLabel.toLowerCase()}
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleAddRow(sectionKey)}
                      disabled={data.readOnly}
                    >
                      Add parameter
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {list.map((row, index) => (
                      <div
                        key={row.id || `${sectionKey}-${index}`}
                        className="grid grid-cols-[auto,1fr,1fr,auto] items-center gap-2 rounded-xl border border-border bg-secondary/50 px-3 py-2"
                      >
                        <Switch
                          checked={row.enabled}
                          onCheckedChange={(checked) =>
                            row.id && appendToPair(sectionKey, row.id, { enabled: checked })
                          }
                          disabled={data.readOnly}
                        />
                        <Input
                          value={row.name}
                          onChange={(event) =>
                            row.id && appendToPair(sectionKey, row.id, { name: event.target.value })
                          }
                          placeholder="Name"
                          className="bg-secondary/50 text-foreground placeholder:text-muted-foreground"
                          disabled={data.readOnly}
                        />
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-2xs uppercase tracking-wider text-muted-foreground">
                              Value
                            </span>
                            <PlaceholderMenu
                              groups={data.placeholders ?? []}
                              onInsert={(placeholder) =>
                                row.id &&
                                appendToPair(sectionKey, row.id, {
                                  value: `${row.value}${placeholder}`,
                                })
                              }
                              disabled={data.readOnly}
                              triggerLabel="Variáveis"
                            />
                          </div>
                          <Input
                            value={row.value}
                            onChange={(event) =>
                              row.id &&
                              appendToPair(sectionKey, row.id, { value: event.target.value })
                            }
                            placeholder="Value"
                            className="bg-secondary/50 text-foreground placeholder:text-muted-foreground"
                            disabled={data.readOnly}
                          />
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => row.id && handleRemoveRow(sectionKey, row.id)}
                          className="h-8 w-8 text-muted-foreground"
                          disabled={data.readOnly}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                    {list.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-border bg-secondary/50 p-4 text-center text-xs text-muted-foreground">
                        No parameters defined
                      </div>
                    ) : null}
                  </div>
                </div>
              )
            })}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-card-foreground">Request body</div>
                  <div className="text-xs text-muted-foreground">
                    Configurable for write operations
                  </div>
                </div>
                <Switch
                  checked={config.bodyEnabled}
                  onCheckedChange={(checked) => data.onConfigChange?.({ bodyEnabled: checked })}
                  disabled={data.readOnly}
                />
              </div>

              {config.bodyEnabled ? (
                <div className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor={`${id}-body-type`} className="text-card-foreground">
                      Content type
                    </Label>
                    <select
                      id={`${id}-body-type`}
                      value={config.bodyContentType}
                      onChange={(event) =>
                        data.onConfigChange?.({
                          bodyContentType: event.target
                            .value as HttpRequestNodeConfig["bodyContentType"],
                        })
                      }
                      className="h-10 w-full rounded-md border border-border bg-secondary/50 px-3 text-foreground"
                      disabled={data.readOnly}
                    >
                      <option value="json">JSON</option>
                      <option value="text">Plain text</option>
                      <option value="formData">Form data</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <Label htmlFor={`${id}-body`} className="text-card-foreground">
                        Body payload
                      </Label>
                      <PlaceholderMenu
                        groups={data.placeholders ?? []}
                        onInsert={handleInsertBodyPlaceholder}
                        disabled={data.readOnly}
                        triggerLabel="Variáveis"
                      />
                    </div>
                    <Textarea
                      ref={bodyRef}
                      value={config.body}
                      onChange={(event) => data.onConfigChange?.({ body: event.target.value })}
                      placeholder='{"key": "value"}'
                      className="min-h-[140px] resize-none bg-secondary/50 font-mono text-foreground placeholder:text-muted-foreground"
                      disabled={data.readOnly}
                    />
                  </div>
                </div>
              ) : null}
            </div>

            {shouldShowInputMapper ? (
              <InputMapper
                value={data.inputs ?? []}
                sources={data.availableSources ?? []}
                onChange={(next) => data.onInputsChange?.(next)}
                disabled={data.readOnly}
              />
            ) : null}
          </div>
        ),
      }}
    />
  )
}

export default memo(HttpRequestNode)
