import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import {Header, Input, Button, ListItem, Icon} from 'react-native-elements';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('shoppinglist.db');

export default function App() {
  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [list, setList] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS shoppinglist (id integer primary key not null, product text, amount text);');
    }, null, updateList);
  }, []);

  const addItem = () => {
    db.transaction(tx => {
      tx.executeSql('INSERT INTO shoppinglist (product, amount) VALUES (?, ?);', [product, amount]);
    }, null, updateList);
    setProduct('');
    setAmount('');
  }

  const deleteItem = (id) => {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM shoppinglist WHERE id = ?;', [id]);
    }, null, updateList)
  }

  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM shoppinglist;', [], (_, {rows}) =>
        setList(rows._array));
    });
  }

  return (
    <View style={styles.container}>
      <Header centerComponent={{text : 'SHOPPING LIST', style : {color : '#fff', paddingVertical : 20}}}/>
      <View style={styles.inputContainer}>
        <Input label='PRODUCT' placeholder='Product' value={product} onChangeText={product => setProduct(product)} />
        <Input label='AMOUNT' placeholder='Amount' value={amount} onChangeText={amount => setAmount(amount)} />
        <View style={styles.buttonContainer}>
          <Button raised icon={{name : 'save', color : 'white'}} title='SAVE' onPress={addItem} />
        </View>
      </View>
      <View style={styles.listContainer}>
      <FlatList
        keyExtractor={item => item.id.toString()}
        data={list}
        renderItem={({item}) =>
          <ListItem bottomDivider>
            <ListItem.Content style={styles.listItem}>
              <View>
                <ListItem.Title style={{fontSize: 20}}>{item.product}</ListItem.Title>
                <ListItem.Subtitle style={{fontSize: 15}}>{item.amount}</ListItem.Subtitle>
              </View>
              <View style={{alignSelf:'center'}}>
                <Icon type='material' name='delete' color='red' onPress={() => deleteItem(item.id)}/>
              </View>
            </ListItem.Content>
          </ListItem>
        }>
      </FlatList>
      </View>
      <StatusBar hidden={true} />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    alignSelf: 'center',
    width: '50%'
  },

  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },

  inputContainer: {
    paddingHorizontal : 10,
    width: '100%'
  },

  listContainer:{
    width: '100%'
  },

  listItem : {
    flexDirection: 'row',
    justifyContent : 'space-between'
  }
});
