import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";

export type JsonNode =
  | string
  | number
  | boolean
  | null
  | JsonNode[]
  | { [key: string]: JsonNode };

interface JsonViewerProps {
  data: JsonNode;
  className?: string;
  textLimit?: number;
}

function JsonViewer({ className, data, textLimit = 80 }: JsonViewerProps) {
  return (
    <TooltipProvider>
      <div
        className={cn(
          "bg-json-background border-json-neutral/50 rounded-md border p-2 font-mono text-sm",
          className,
        )}
      >
        <JsonNode
          data={data}
          name="root"
          textLimit={textLimit}
          defaultIsExpanded
        />
      </div>
    </TooltipProvider>
  );
}

interface JsonNodeProps {
  name: string;
  data: JsonNode;
  level?: number;
  defaultIsExpanded?: boolean;
  textLimit: number;
}

function assertPrimitive(
  data: JsonNode,
): data is string | number | boolean | null {
  const dataType = typeof data;
  return (
    data === null ||
    dataType === "string" ||
    dataType === "number" ||
    dataType === "boolean"
  );
}

function JsonNode({
  name,
  data,
  textLimit,
  level = 0,
  defaultIsExpanded = false,
}: JsonNodeProps) {
  const [isExpanded, setIsExpanded] = React.useState(defaultIsExpanded);

  const isPrimitive = assertPrimitive(data);
  const isArr = !isPrimitive && Array.isArray(data);
  const itemCount = isPrimitive
    ? 0
    : isArr
      ? data.length
      : Object.keys(data).length;

  const Comp = isPrimitive ? "div" : "button";

  return (
    <div className={cn("pl-4", level > 0 && "border-json-neutral/50 border-l")}>
      <Comp
        className="hover:bg-json-neutral/15 -ml-4 flex h-full w-full gap-1 rounded-[calc(var(--radius)-8px)] px-1.5 py-1"
        onClick={() => !isPrimitive && setIsExpanded((prev) => !prev)}
      >
        {isPrimitive ? (
          <div className="pl-3" />
        ) : (
          <div className="text-json-neutral flex w-4 items-center justify-center">
            {isExpanded ? (
              <ChevronDown className="size-3.5" />
            ) : (
              <ChevronRight className="size-3.5" />
            )}
          </div>
        )}

        <span>
          <span className="text-json-key">{name}</span>
          <span className="text-json-neutral">:</span>
        </span>

        {!isPrimitive && (
          <span>
            <span className="text-json-bracket">{isArr ? "[" : "{"}</span>
            {!isExpanded && (
              <>
                <span className="text-json-neutral">
                  &nbsp;
                  {itemCount === 0
                    ? "empty " + (isArr ? "array" : "object")
                    : itemCount + (itemCount === 1 ? " item" : " items")}
                  &nbsp;
                </span>
                <span className="text-json-bracket">{isArr ? "]" : "}"}</span>
              </>
            )}
          </span>
        )}

        {isPrimitive && <JsonValue data={data} textLimit={textLimit} />}
      </Comp>

      {!isPrimitive && isExpanded && (
        <div className="pl-3">
          {itemCount === 0 && (
            <span className="text-json-neutral border-json-neutral/50 inline-block border-l pl-4 italic">
              empty {isArr ? "array" : "object"}
            </span>
          )}

          {Object.entries(data).map(([key, data]) => (
            <JsonNode
              key={`${key}-level-${level}`}
              name={`${key}`}
              data={data}
              level={level + 1}
              textLimit={textLimit}
              defaultIsExpanded={level < 1}
            />
          ))}
          <div>
            <span className="text-json-bracket">{isArr ? "]" : "}"}</span>
          </div>
        </div>
      )}
    </div>
  );
}

interface JsonValueProps {
  data: string | number | boolean | null;
  textLimit: number;
}

function JsonValue({ data, textLimit }: JsonValueProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  if (data === null) {
    return <span className="text-json-null">null</span>;
  }

  if (typeof data === "string") {
    if (data.length > textLimit) {
      return (
        <>
          {isExpanded ? (
            <span className="text-json-string">
              <Quote />
              {data}
              <button
                className="text-json-neutral bg-json-neutral/15 hover:bg-json-neutral/25 ml-1.5 inline-flex h-4 cursor-pointer items-center justify-center rounded-[4px] px-1"
                onClick={() => setIsExpanded((prev) => !prev)}
              >
                show less
              </button>
              <Quote />
            </span>
          ) : (
            <Tooltip>
              <TooltipTrigger className="text-json-string" asChild>
                <span>
                  <Quote />
                  {data.substring(0, textLimit)}
                  <button
                    className="text-json-neutral bg-json-neutral/15 hover:bg-json-neutral/25 ml-1.5 inline-flex h-4 cursor-pointer items-center justify-center rounded-[4px] px-1"
                    onClick={() => setIsExpanded((prev) => !prev)}
                  >
                    show more
                  </button>
                  <Quote />
                </span>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                align="center"
                className="[&_svg]:border-json-neutral/15 bg-json-background text-json-string border-json-neutral/15 [&_svg]:bg-json-background [&_svg]:fill-json-background max-w-md border p-2 text-xs break-words [&_svg]:translate-y-[calc(-50%)] [&_svg]:border-r [&_svg]:border-b"
              >
                {data}
              </TooltipContent>
            </Tooltip>
          )}
        </>
      );
    }
    return (
      <span className="text-json-string">
        <Quote />
        {data}
        <Quote />
      </span>
    );
  }

  if (typeof data === "number") {
    return <span className="text-json-number">{data}</span>;
  }

  if (typeof data === "boolean") {
    return (
      <span className={data ? "text-json-true" : "text-json-false"}>
        {String(data)}
      </span>
    );
  }

  return (
    <span className="text-json-string">
      <Quote />
      {data}
      <Quote />
    </span>
  );
}

function Quote() {
  return <span className="text-json-quote">&quot;</span>;
}

export { JsonViewer, type JsonViewerProps };
