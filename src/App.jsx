import "./App.css";
import { Meteors } from "@/components/ui/meteors";
import { AnimatedThemeToggler } from "./components/ui/animated-theme-toggler";
import { MorphingText } from "@/components/ui/morphing-text";
import { RippleButton } from "@/components/ui/ripple-button";
import { GlareHover } from "@/components/ui/glare-hover";
import { AvatarCircles } from "@/components/ui/avatar-circles";
import {
  HStack,
  Stack,
  VStack,
  Box,
  Input,
  InputGroup,
  EmptyState,
  Checkbox,
  Editable,
  IconButton,
  ScrollArea,
} from "@chakra-ui/react";

import { CirclePlus, Ghost, X, Check, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const texts = ["Todo List", "Plan", "Focus", "Complete", "Repeat"];

  const [tasks, addTask] = useState(()=>{
      const stored = localStorage.getItem("Tasks");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.log(e);
          return [];
        }
      }
      return [];
  });
  const [title, setTitle] = useState("");

  const onWritingTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleAdd = () => {
    if (!title.trim()) return;

    const task = {
      Id: crypto.randomUUID(),
      Title: title,
      Completed: false,
    };
    addTask([task, ...tasks]);
    setTitle("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAdd();
  };

  const deleteTask = (id) => {
    addTask((prev) => prev.filter((task) => task.Id !== id));
  };

  const toggleTask = (Id, Completed) => {
    addTask((prev) =>
      prev.map((task) => (Id === task.Id ? { ...task, Completed } : task)),
    );
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.Completed === b.Completed) return 0;
    return a.Completed ? 1 : -1;
  });

  useEffect(()=>{
      localStorage.setItem("Tasks", JSON.stringify(tasks));
  },[tasks])

  return (
    <Stack minH="100vh" gap={0}>
      <HStack
        justifyContent="flex-end"
        padding={4}
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={50}
        className="backdrop-blur-[2px]"
        gap={4}
      >
        <AvatarCircles
          avatarUrls={[
            {
              imageUrl: "https://avatars.githubusercontent.com/u/149034143?v=4",
              profileUrl: "https://github.com/Tonoy3951573",
            },
          ]}
        />
        <AnimatedThemeToggler />
      </HStack>

      <Box
        position="relative"
        h="100vh"
        w="100vw"
        overflow="hidden"
        as="form"
        onSubmit={handleSubmit}
      >
        <Meteors className="ml-25" />
        <VStack h="full" w="full" marginTop="65px">
          <MorphingText texts={texts} />
          <HStack gap={4} width={500} marginTop={10} marginBottom={8}>
            <InputGroup startElement={<CirclePlus className="size-5" />}>
              <Input
                placeholder="e.g. Learning React"
                padding={8}
                rounded={12}
                value={title}
                onChange={onWritingTitle}
                borderWidth="2px"
                className="backdrop-blur-[2px]"
              />
            </InputGroup>
            <RippleButton className="border-2 p-5"> Add </RippleButton>
          </HStack>

          <ScrollArea.Root h="full" width={500} hideScrollbar>
            <ScrollArea.Viewport h="full">
            {tasks.length == 0 ? (
              <EmptyState.Root size="lg">
                <EmptyState.Content>
                  <EmptyState.Indicator>
                    {" "}
                    <Ghost />{" "}
                  </EmptyState.Indicator>
                  <EmptyState.Title>Nothing To Do Today</EmptyState.Title>
                  <EmptyState.Description>
                    Little Gost is very sad. Add some task to make him happy
                  </EmptyState.Description>
                </EmptyState.Content>
              </EmptyState.Root>
            ) : (
              <AnimatePresence mode="popLayout">
                {sortedTasks.map((task) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{
                      opacity: 0,
                      scale: 0.95,
                      transition: { duration: 0.2 },
                    }}
                    transition={{ duration: 0.3 }}
                    key={task.Id}
                    style={{ width: "100%" }}
                  >
                    <Box
                      borderWidth="2px"
                      zIndex={0}
                      rounded={12}
                      className="backdrop-blur-sm mt-2"
                      opacity={task.Completed ? 0.5 : 1}
                      transition="opacity 0.25s ease, transform 0.25s ease"
                    >
                      <GlareHover
                        className="rounded-lg w-full "
                        background="bg.panel"
                        color="#565656"
                        duration={700}
                      >
                        <HStack justify="space-between" w="full" p={4}>
                          <HStack flex={1}>
                            <Checkbox.Root
                              colorPalette="blue"
                              checked={task.Completed}
                              onCheckedChange={(details) =>
                                toggleTask(task.Id, details.checked)
                              }
                            >
                              <Checkbox.HiddenInput />
                              <Checkbox.Control rounded="full" w={6} h={6} />
                            </Checkbox.Root>

                            <Editable.Root
                              flex={1}
                              defaultValue={task.Title}
                              activationMode="dblclick"
                              disabled={task.Completed}
                            >
                              <Editable.Preview
                                cursor={task.Completed ? "disabled" : "text"}
                                textDecoration={
                                  task.Completed ? "line-through" : "none"
                                }
                                opacity={task.Completed ? 0.6 : 1}
                              />
                              <Editable.Input
                                textDecoration={
                                  task.Completed ? "line-through" : "none"
                                }
                              />

                              <Editable.Control>
                                <Editable.CancelTrigger asChild>
                                  <IconButton variant="ghost" size="xs">
                                    <X />
                                  </IconButton>
                                </Editable.CancelTrigger>

                                <Editable.SubmitTrigger asChild>
                                  <IconButton variant="ghost" size="xs">
                                    <Check />
                                  </IconButton>
                                </Editable.SubmitTrigger>
                              </Editable.Control>
                            </Editable.Root>
                            <RippleButton
                              className="size-12 rounded-full outline-0"
                              onClick={() => deleteTask(task.Id)}
                            >
                              <Trash size={20} color="red" />
                            </RippleButton>
                          </HStack>
                        </HStack>
                      </GlareHover>
                    </Box>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            </ScrollArea.Viewport>
          </ScrollArea.Root>
        </VStack>
      </Box>
    </Stack>
  );
}

export default App;
