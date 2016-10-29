<Animatable.View animation="flipInX" delay={rowID*80} duration={rowID*100} style={{flex:1,flexDirection:'column',justifyContent:'space-around',borderBottomColor:'white',borderBottomWidth:1,margin:10,paddingLeft:10}}>
  <Text style={{color:"white",marginBottom:10,fontWeight:'bold'}}>{rowData.title}</Text>
  <Text style={{color:'white',paddingBottom:10,}}>{rowData.content}</Text>
</Animatable.View>
