import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// 🎨 Styles professionnels
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
    padding: 40,
    color: "#1e293b", // slate-800
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  logoImage: {
    width: 120,
    height: 40,
    objectFit: "contain",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e3a8a",
    textAlign: "center",
    marginBottom: 20,
    textTransform: "uppercase",
  },
  box: {
    backgroundColor: "#eff6ff", // blue-50
    border: "1px solid #60a5fa", // blue-400
    borderRadius: 10,
    padding: 20,
    marginTop: 10,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#1d4ed8", // blue-700
  },
  sectionValue: {
    fontSize: 12,
    color: "#0f172a", // slate-900
    marginBottom: 12,
    wordBreak: "break-word",
  },
  infoText: {
    fontSize: 11,
    fontStyle: "italic",
    color: "#475569", // slate-600
    marginTop: 10,
  },
  signature: {
    marginTop: 40,
    fontSize: 10,
    textAlign: "right",
    color: "#64748b",
  },
  footer: {
    marginTop: 50,
    borderTop: "1px solid #e2e8f0",
    paddingTop: 10,
    textAlign: "center",
    fontSize: 10,
    color: "#94a3b8",
  },
});

export default function VoteReceiptPDF({
  hash,
  date,
}: {
  hash: string;
  date: string;
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Logo en haut */}
        <View style={styles.logoContainer}>
          <Image src="/logo_demos.png" style={styles.logoImage} />
        </View>

        {/* Titre */}
        <Text style={styles.title}>Récépissé de vote</Text>

        {/* Contenu principal */}
        <View style={styles.box}>
          <Text style={styles.sectionLabel}>Identifiant unique</Text>
          <Text style={styles.sectionValue}>{hash}</Text>

          <Text style={styles.sectionLabel}>Date d'émission</Text>
          <Text style={styles.sectionValue}>{date} (heure de Paris)</Text>

          <Text style={styles.infoText}>
            Ce document constitue un récépissé de vote. Il contient un identifiant unique
            généré de manière sécurisée. Ce récépissé peut être utilisé pour vérifier
            la présence de votre vote dans l'urne via l'interface de vérification du site.
          </Text>
        </View>

        {/* Signature factice */}
        <Text style={styles.signature}>
          Système de Vote Électronique
          {"\n"}Autorité de gestion
        </Text>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Document généré automatiquement - Ne pas modifier</Text>
          <Text>www.vote-electronique.fr</Text>
        </View>
      </Page>
    </Document>
  );
}
