import React from "react"
import { View, Text, StyleSheet, TouchableOpacity, Switch } from "react-native"
import { useTheme } from "../styles/theme"
import { Ionicons } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function ProfileScreen() {
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingBottom: insets.bottom }]}>
      <View style={styles.profileHeader}>
        <Ionicons name="person-circle-outline" size={100} color={colors.primary} />
        <Text style={[styles.username, { color: colors.text }]}>John Doe</Text>
      </View>
      <View style={styles.settingsContainer}>
        <SettingItem
          icon="notifications-outline"
          text="Notifications"
          colors={colors}
          rightElement={
            <Switch trackColor={{ false: colors.border, true: colors.primary }} thumbColor={colors.background} />
          }
        />
        <SettingItem icon="lock-closed-outline" text="Privacy" colors={colors} />
        <SettingItem icon="color-palette-outline" text="Theme" colors={colors} />
        <SettingItem icon="help-circle-outline" text="Help & Support" colors={colors} />
        <SettingItem icon="log-out-outline" text="Log Out" colors={colors} textColor={colors.primary} />
      </View>
    </View>
  )
}

const SettingItem = ({ icon, text, colors, rightElement, textColor }) => (
  <TouchableOpacity style={styles.settingItem}>
    <View style={styles.settingLeft}>
      <Ionicons name={icon} size={24} color={colors.text} />
      <Text style={[styles.settingText, { color: textColor || colors.text }]}>{text}</Text>
    </View>
    {rightElement}
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 30,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  settingsContainer: {
    marginTop: 20,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingText: {
    fontSize: 16,
    marginLeft: 15,
  },
})


