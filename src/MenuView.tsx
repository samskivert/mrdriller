import { Button, Flex, Heading } from "@radix-ui/themes"
import * as React from "react"
import { Drill } from "./model"

export function MenuView({
  drills,
  onSelectDrill,
}: {
  drills: Drill[]
  onSelectDrill: (drill: Drill) => void
}) {
  return (
    <Flex direction="column" gap="6">
      <Heading align="center" size="8">
        Mr. Driller
      </Heading>
      <Flex direction="column" gap="4">
        {drills.map((drill, index) => (
          <Button key={index} onClick={() => onSelectDrill(drill)} size="4">
            {drill.title}
          </Button>
        ))}
      </Flex>
    </Flex>
  )
}
