import React, { useState, useEffect } from 'react'
import { Feather as Icon } from "@expo/vector-icons";
import { Platform, Picker, View, ImageBackground, Text, Image, KeyboardAvoidingView } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

import styles from "./styles";
import axios from 'axios'; 

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const Home = () => {
  const [ufList, setUfList] = useState<string[]>([]);
  const [cityList, setCityList] = useState<string[]>([]);

  const [uf, setUf] = useState("");
  const [city, setCity] = useState("");
  const navigation = useNavigation();

  //configurando lista de estados
  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(response => {
        const ufInitials = response.data.map(uf => uf.sigla);
        setUfList(ufInitials.sort());
      })
  }, [])

  //configurando lista de cidades por uf
  useEffect(() => {
    if(uf === '0') {
      return;
    }
    
    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
      .then(response => {
          const cityNames = response.data.map(city => city.nome);
          setCityList(cityNames);
      });
  }, [uf]);


  function handleNavigateToPoints() {
    navigation.navigate('Points', {
      uf,
      city,
    });
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1}} behavior={Platform.OS ==='ios' ? 'padding' : undefined}>
      <ImageBackground 
        source={require('../../assets/home-background.png')} 
        style={styles.container}
        imageStyle={{ width: 274, height:368 }}
      >
        <View style={styles.main}>
        <Image source={require("../../assets/logo.png")}/>
          <View>  
            <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
            <Text style={styles.description}>
              Ajudamos as pessoas a encontrarem pontos de coleta de forma eficiente.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          {/* <TextInput 
            style={styles.input}
            placeholder="Digite a UF"
            value={uf}
            maxLength={2}
            autoCapitalize="characters"
            autoCorrect={false}
            onChangeText={setUf}
          /> */}
          <Picker
            style={styles.select}
            selectedValue={uf}
            onValueChange={(item) => setUf(item)}
          > 
            <Picker.Item label="Selecione o estado" value="0" />
            {ufList.map(uf => (
              <Picker.Item key={uf} label={uf} value={uf} />
            ))}
          </Picker>
          
          {/* <TextInput 
            style={styles.input}
            placeholder="Digite a cidade"
            value={city}
            autoCorrect={false}
            onChangeText={setCity}
          /> */}
          <Picker
            style={styles.select}
            selectedValue={city}
            onValueChange={(item) => setCity(item)}
          > 
            <Picker.Item label="Selecione a cidade" value="0" />
            {cityList.map(city => (
              <Picker.Item key={city} label={city} value={city} />
            ))}
          </Picker>

          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}> 
              <Text> 
                <Icon name="arrow-right" color="#fff" size={24} />
              </Text>
            </View>
            
            <Text style={styles.buttonText}>
              Entrar
            </Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  )
};

export default Home;