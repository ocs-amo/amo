'use client';
import { CameraIcon } from '@yamada-ui/lucide';
import type { SelectItem} from '@yamada-ui/react';
import { Button, Center, FormControl, Heading, Input, Label, Select, Text, VStack } from '@yamada-ui/react';
import Link from 'next/link';

const items: SelectItem[] = [
  {
    label: '乃木',
    value: '乃木'
  },
  {
    label: '西村',
    value: '西村'
  },
  {
    label: '木村',
    value: '木村'
  },
];

const CircleCreate = () => {
  return <VStack gap={0} w="full" h="full">
    <Center w="full" h="40" backgroundColor="gray.100">
      <VStack alignItems="center" gap={0}>
        <CameraIcon size="9xl" color="gray" />
        <Text color="gray" size="xl">ヘッダー画像</Text>
      </VStack>
    </Center>
    <VStack p="md" maxW="5xl" m="auto" gap="lg" flexGrow={1}>
      <Heading as="h1" size="lg">サークル作成</Heading>
      <form onSubmit={e => e.preventDefault()}>
        <VStack px="md">
          <FormControl isRequired display="flex" flexDirection={{base: 'row', md: 'column'}} gap={{base: '2xl', md: 'md'}} maxW="2xl">
            <Label flexGrow={1}>サークル名</Label>
            <Input type="text" w={{base: 'md', md: 'full'}} placeholder="サークル名を入力" />
          </FormControl>
          <FormControl display="flex" flexDirection={{base: 'row', md: 'column'}} gap={{base: '2xl', md: 'md'}} maxW="2xl">
            <Label flexGrow={1}>講師</Label>
            <Select w={{base: 'md', md: 'full'}} placeholder="講師を選択" items={items} />
          </FormControl>
          <FormControl display="flex" flexDirection={{base: 'row', md: 'column'}} gap={{base: '2xl', md: 'md'}} maxW="2xl">
            <Label flexGrow={1}>タグ</Label>
            <Input type="text" w={{base: 'md', md: 'full'}} placeholder="タグを入力" />
          </FormControl>
          <FormControl display="flex" flexDirection={{base: 'row', md: 'column'}} gap={{base: '2xl', md: 'md'}} maxW="2xl">
            <Label flexGrow={1}>活動場所</Label>
            <Input type="text" w={{base: 'md', md: 'full'}} placeholder="活動場所を入力" />
          </FormControl>
          <FormControl display="flex" flexDirection={{base: 'row', md: 'column'}} gap={{base: '2xl', md: 'md'}} maxW="2xl">
            <Label flexGrow={1}>活動時間</Label>
            <Input type="text" w={{base: 'md', md: 'full'}} placeholder="活動時間を入力" />
          </FormControl>
          <Center gap="md" justifyContent="end">
            <Button as={Link} href="/circles">キャンセル</Button>
            <Button type="submit">作成</Button>
          </Center>
        </VStack>
      </form>
    </VStack>
  </VStack>;
};

export default CircleCreate;