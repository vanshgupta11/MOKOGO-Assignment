import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import  data  from "./_data";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("All");
  const [maxRent, setMaxRent] = useState("20000");
  const [gender, setGender] = useState("Any");
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(false);

  // Simulate a fetch delay
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const cities = useMemo(() => {
    const unique = Array.from(new Set(data.map((item) => item.city)));
    return ["All", ...unique];
  }, []);

  const genders = ["Any", "Male", "Female"];

  const filteredData = useMemo(() => {
    const filtered = data.filter((item) => {
      const cityMatch = city === "All" || item.city === city;
      const rentMatch = item.rent <= Number(maxRent || 0);
      const genderMatch =
        gender === "Any" ||
        item.preferredGender === "Any" ||
        item.preferredGender === gender;
      const searchMatch =
        search.trim() === "" ||
        item.title.toLowerCase().includes(search.trim().toLowerCase()) ||
        item.locality.toLowerCase().includes(search.trim().toLowerCase());
      return cityMatch && rentMatch && genderMatch && searchMatch;
    });

    if (sortAsc) {
      return [...filtered].sort((a, b) => a.rent - b.rent);
    }
    return filtered;
  }, [city, maxRent, gender, search, sortAsc]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading listings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find a room</Text>

      <Text style={styles.label}>City</Text>
      <View style={styles.row}>
        {cities.map((c) => (
          <Pressable
            key={c}
            onPress={() => setCity(c)}
            style={[styles.pill, city === c && styles.pillActive]}
          >
            <Text style={[styles.pillText, city === c && styles.pillTextActive]}>{c}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Max Rent</Text>
      <TextInput keyboardType="numeric" value={maxRent} onChangeText={setMaxRent} style={styles.input} />

      <Text style={styles.label}>Preferred Gender</Text>
      <View style={styles.row}>
        {genders.map((g) => (
          <Pressable
            key={g}
            onPress={() => setGender(g)}
            style={[styles.pill, gender === g && styles.pillActive]}
          >
            <Text style={[styles.pillText, gender === g && styles.pillTextActive]}>{g}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Search (title or locality)</Text>
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="e.g. Baner, studio, metro"
        style={styles.input}
      />

      <Pressable onPress={() => setSortAsc((prev) => !prev)} style={styles.sortButton}>
        <Text style={styles.sortText}>
          Sort: Rent {sortAsc ? "(Low to High) ✓" : "(Low to High)"}
        </Text>
      </Pressable>

      <Text style={styles.results}>Results: {filteredData.length}</Text>

      <FlatList
        data={filteredData}
        contentContainerStyle={styles.list}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.empty}>No listings match your filters.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardMeta}>
              {item.locality}, {item.city}
            </Text>
            <Text style={styles.cardMeta}>₹{item.rent}/month</Text>
            <Text style={styles.cardMeta}>{item.roomType}</Text>
            <Text style={styles.cardMeta}>Preferred: {item.preferredGender}</Text>
            <Text style={styles.cardMeta}>{item.furnished ? "Furnished" : "Unfurnished"}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f7f7f7",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  loadingText: {
    color: "#444",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
    color: "#111",
  },
  label: {
    marginTop: 10,
    marginBottom: 6,
    fontWeight: "600",
    color: "#222",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 999,
    backgroundColor: "#fff",
  },
  pillActive: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  pillText: {
    color: "#222",
  },
  pillTextActive: {
    color: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  sortButton: {
    marginTop: 12,
    alignSelf: "flex-start",
  },
  sortText: {
    color: "#1f4b99",
    fontWeight: "600",
  },
  results: {
    marginTop: 14,
    marginBottom: 8,
    fontWeight: "700",
    color: "#111",
  },
  list: {
    paddingBottom: 16,
  },
  empty: {
    marginTop: 20,
    textAlign: "center",
    color: "#666",
  },
  card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  cardTitle: {
    fontWeight: "700",
    color: "#111",
    marginBottom: 4,
  },
  cardMeta: {
    color: "#444",
    marginBottom: 2,
  },
});