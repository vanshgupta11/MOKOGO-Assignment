import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
} from "react-native";
import data from "./_data";

export default function Index() {
  const [city, setCity] = useState("All");
  const [maxRent, setMaxRent] = useState("20000");
  const [gender, setGender] = useState("Any");

  const cities = useMemo(() => {
    const unique = Array.from(new Set(data.map((item) => item.city)));
    return ["All", ...unique];
  }, []);

  const genders = ["Any", "Male", "Female"];

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const cityMatch = city === "All" || item.city === city;
      const rentMatch = item.rent <= Number(maxRent || 0);
      const genderMatch =
        gender === "Any" ||
        item.preferredGender === "Any" ||
        item.preferredGender === gender;
      return cityMatch && rentMatch && genderMatch;
    });
  }, [city, maxRent, gender]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find a room</Text>
      <Text style={styles.subtitle}>Filter listings by city, rent, and gender.</Text>

      <Text style={styles.label}>City</Text>
      <View style={styles.chipRow}>
        {cities.map((c) => (
          <Pressable
            key={c}
            onPress={() => setCity(c)}
            style={[styles.chip, city === c && styles.chipActive]}
          >
            <Text style={[styles.chipText, city === c && styles.chipTextActive]}>
              {c}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Max Rent</Text>
      <TextInput
        keyboardType="numeric"
        value={maxRent}
        onChangeText={setMaxRent}
        style={styles.input}
        placeholder="Enter max rent"
        placeholderTextColor="#8a8a8a"
      />

      <Text style={styles.label}>Preferred Gender</Text>
      <View style={styles.chipRow}>
        {genders.map((g) => (
          <Pressable
            key={g}
            onPress={() => setGender(g)}
            style={[styles.chip, gender === g && styles.chipActive]}
          >
            <Text style={[styles.chipText, gender === g && styles.chipTextActive]}>
              {g}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.results}>{filteredData.length} results</Text>

      <FlatList
        contentContainerStyle={styles.list}
        data={filteredData}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.empty}>No listings match your filters.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardMeta}>
              {item.locality}, {item.city}
            </Text>
            <Text style={styles.cardPrice}>₹{item.rent}/month</Text>
            <Text style={styles.cardDetail}>{item.roomType}</Text>
            <Text style={styles.cardDetail}>Preferred: {item.preferredGender}</Text>
            <Text style={styles.cardDetail}>{item.furnished ? "Furnished" : "Unfurnished"}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f7fb",
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#10233f",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#667085",
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#10233f",
    marginTop: 10,
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#e8edf5",
  },
  chipActive: {
    backgroundColor: "#10233f",
  },
  chipText: {
    fontSize: 13,
    color: "#10233f",
    fontWeight: "600",
  },
  chipTextActive: {
    color: "#ffffff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d7deea",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#10233f",
  },
  results: {
    marginTop: 18,
    marginBottom: 12,
    fontSize: 15,
    fontWeight: "700",
    color: "#10233f",
  },
  list: {
    paddingBottom: 24,
  },
  empty: {
    paddingVertical: 24,
    textAlign: "center",
    color: "#667085",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e4e9f2",
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#10233f",
    marginBottom: 4,
  },
  cardMeta: {
    fontSize: 13,
    color: "#667085",
    marginBottom: 10,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f766e",
    marginBottom: 8,
  },
  cardDetail: {
    fontSize: 13,
    color: "#344054",
    marginBottom: 4,
  },
});