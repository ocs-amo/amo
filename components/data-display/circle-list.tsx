"use client"

import type { FC} from "@yamada-ui/react";
import { Button, Center, Text, VStack } from "@yamada-ui/react"
import Link from "next/link"
import { PaginationGrid } from "../navigation/pagination-grid"
import { CircleCard } from "./circle-card"
import type { getCirclesByUserId } from "@/actions/circle/fetch-circle"

interface CircleListProps {
  circles: Awaited<ReturnType<typeof getCirclesByUserId>>
  instructor?: boolean
}

export const CircleList: FC<CircleListProps> = ({ circles, instructor }) => (
  <PaginationGrid data={circles || []} itemsPerPage={3} columns={3}>
    {(currentPageData) =>
      currentPageData.length ? (
        currentPageData.map((data) => <CircleCard key={data.id} data={data} />)
      ) : (
        <Center w="full" h="full" as={VStack}>
          {instructor ? (
            <Text>講師を担当していません</Text>
          ) : (
            <>
              <Text>サークルに入っていません</Text>
              <Button as={Link} href="/circles">
                サークルを探す
              </Button>
            </>
          )}
        </Center>
      )
    }
  </PaginationGrid>
)
