# Keycloak Passwort-Reset & SMTP

## SMTP in Keycloak einrichten

Im Keycloak-Admin unter "Realm settings" → "Email" Folgendes eintragen:

- From: noreply@example.com
- From display name: libria
- Host: fakesmtp
- Port: 8025
- SSL/StartTLS: aus
- Authentication: aus

Speichern und auf "Test connection" klicken. Die Testmail sollte im FakeSMTP-Webinterface auftauchen.

## Passwort-Reset aktivieren

Unter "Realm settings" → "Login" den Schalter bei "Forgot password" aktivieren.
Unter "Authentication" → "Required Actions" den Schalter bei "Update Password" aktivieren.
Unter "Authentication" → "Flows" → "Reset Credentials" prüfen, ob "Send Reset Email" und "Update Password" im Flow sind.

## Benutzer prüfen

Im Bereich "Users" den Benutzer auswählen:

- E-Mail muss eingetragen sein
- "Email verified" auf On stellen
- Benutzer muss aktiviert sein

## Passwort-Reset testen

Im Login auf "Passwort vergessen?" klicken, E-Mail eingeben, Mail im FakeSMTP-Web anschauen und den Link nutzen.
