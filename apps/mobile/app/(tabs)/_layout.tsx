import { Tabs } from 'expo-router'

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Quotes' }} />
      <Tabs.Screen name="highlight" options={{ title: 'Highlight' }} />
    </Tabs>
  )
}
