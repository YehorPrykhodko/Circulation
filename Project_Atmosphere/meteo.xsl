<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">   <xsl:output method="html" encoding="UTF-8" indent="yes"/>
   <xsl:template match="/">

        <div id="WeatherContainer">

            <div>
                <h2>Matin</h2>
                <h3>🌅</h3>

                <xsl:apply-templates select="//echeance[@hour='9']"/>
            </div>

            <div>
                <h2>Midi</h2>
                <h3>🏙️</h3>
                <xsl:apply-templates select="//echeance[@hour='12']"/>
            </div>

            <div>
                <h2>Soir</h2>
                <h3>🌇</h3>
                <xsl:apply-templates select="//echeance[@hour='18']"/>
            </div>
        </div>
    </xsl:template>

   <xsl:template match="echeance">
      <h3>
            <xsl:choose>
                <xsl:when test="risque_neige = 'oui'">
                    <span>❄️ Neige</span>
                </xsl:when>

                <xsl:when test="pluie > 0 and nebulosite/level[@val='totale'] > 50">
                    <span>⛈️ Pluie et Nuages</span>
                </xsl:when>
                <xsl:when test="pluie > 0">
                    <span>🌦️ Averse</span>
                </xsl:when>

                <xsl:when test="nebulosite/level[@val='totale'] > 50">
                    <span>☁️ Nuageux</span>
                </xsl:when>

                <xsl:otherwise>
                    <span>☀️ Clair</span>
                </xsl:otherwise>
            </xsl:choose>
        </h3>

         <p>
            <strong>Température:</strong>
            <xsl:value-of select="format-number(temperature/level[@val='2m'] - 273.15, '0.0')"/> °C
        </p>
        <p>
            <strong>Humidité:</strong>
            <xsl:value-of select="humidite/level[@val='2m']"/> %
        </p>

        <p>
            <strong>Vent moyen:</strong>
            <xsl:value-of select="vent_moyen/level[@val='10m']"/> m/s
        </p>
    </xsl:template>
</xsl:stylesheet>
