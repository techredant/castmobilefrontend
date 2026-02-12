import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface StatusCardProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
}

export default function StatusCard({
  title,
  description,
  action,
  children,
}: StatusCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {children}

        <Text style={styles.title}>{title}</Text>

        {description && (
          <Text style={styles.description}>{description}</Text>
        )}

        {action && <View style={styles.action}>{action}</View>}
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginTop: 6,
    textAlign: "center",
  },
  action: {
    marginTop: 16,
  },
});
