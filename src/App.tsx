import React from "react";
import { JsonNode, JsonViewer } from "./components/json-viewer";
import { ModeToggle } from "./components/mode-toggle";
import { Textarea } from "./components/ui/textarea";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { ThemeSelect } from "./components/theme-select";

const defaultJson = {
  string: "Hello, world!",
  number: 42,
  boolean: true,
  boolean2: false,
  null: null,
  object: {
    nested: {
      value: "This is nested",
      array: [1, 2, 3],
    },
    empty: {},
  },
  array: [
    "string",
    123,
    false,
    {
      key: "value",
    },
    ["nested", "array"],
  ],
  longText:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.",
  createdAt: new Date().toISOString(),
};

function App() {
  const [jsonString, setJsonString] = React.useState(
    JSON.stringify(defaultJson, null, 2),
  );
  const [json, setJson] = React.useState<JsonNode>(defaultJson);

  return (
    <>
      <main className="grid h-full max-h-screen min-h-screen grid-cols-1 grid-rows-[auto_repeat(2,minmax(0,1fr))] gap-4 p-4 lg:grid-cols-2 lg:grid-rows-[auto_minmax(0,1fr)]">
        <div className="flex h-fit items-center justify-between gap-4 py-4 lg:col-span-2">
          <h1 className="text-3xl font-bold">JSON Viewer</h1>
          <div className="flex gap-2">
            <ThemeSelect />
            <ModeToggle />
          </div>
        </div>

        <Textarea
          className="focus-visible:ring-json-neutral/50 border-json-neutral/50 bg-json-background dark:bg-json-background text-json-key overflow-auto font-mono"
          spellCheck={false}
          name="json"
          id="json-input"
          onChange={(e) => {
            setJsonString(e.target.value);
            try {
              setJson(JSON.parse(e.target.value));
              toast.dismiss("invalid-json");
            } catch (error) {
              setJson(null);
              toast.error(
                <div>
                  Error:
                  <br />
                  {error instanceof Error ? error.message : "Unknown error"}
                </div>,
                {
                  id: "invalid-json",
                  richColors: true,
                  position: "bottom-left",
                  dismissible: false,
                  duration: Infinity,
                },
              );
            }
          }}
          value={jsonString}
        ></Textarea>
        <JsonViewer className="overflow-auto" data={json} />
      </main>

      <Toaster />
    </>
  );
}

export default App;
