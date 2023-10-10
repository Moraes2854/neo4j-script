const { Driver } = require('neo4j-driver');
const names = require('../data/names.json');
const { toNativeTypes } = require('../utils/utils');
const { removeAccents } = require('../helpers/removeAccents');

class AmountDataService {
    driver
    constructor(driver = new Driver()) {
      this.driver = driver;
    }

    async createAllData(){
      const session = this.driver.session();
      const colorsNames = ['VERDE', 'ROJO', 'CELESTE', 'BORDO', 'NARANJA' ];
      let query = 'CREATE';
      for (let index = 0; index < colorsNames.length; index++) {
        const color = colorsNames[index];
        query=`${query}
        (c${index}:Color{
          colorId: ${index},
          name: '${color}'
        })${index < colorsNames.length-1 ? ',' : ''}`;  
      }
      await session.executeWrite(
        tx => tx.run(query)
      );
      console.log('COLORS CREATED');
      await session.close();

      let start = 0;
      let end = 5000;

      for (let rounds = 0; rounds < 4; rounds++) {
        await this.#createData( start, end );
        start+=5000;
        end+=5000;
      }

      return;
    }

    async getAllDataByColor(colorName){
      const query = `
      MATCH (c:Color {name: '${colorName}'})--(p:Person)--(d:Dni)
      RETURN p {
        .*,
        colorName: c.name,
        dni: d.number
      } as person
      `;
      const session = this.driver.session();
      const res = await session.executeRead(
        tx => tx.run( query ),
      );
      console.log(res.records.map(row => toNativeTypes(row.get('person'))))
      console.log(res.records.length)
      // const persons = res.records.map(row => toNativeTypes(row.get('person').properties))
      // console.log(persons);
      // console.log(persons.length);
      await session.close();
    }

    async deleteAllData(){
      const session = this.driver.session();
      await session.executeWrite(tx =>
        tx.run(
          'MATCH (n) DETACH DELETE n'
        )
      )
      console.log('All data deleted')
      await session.close();
    }

    async #createData(start, end){
      const session = this.driver.session();
      let query = `
        MATCH (c0:Color {colorId: 0})
        MATCH (c1:Color {colorId: 1})
        MATCH (c2:Color {colorId: 2})
        MATCH (c3:Color {colorId: 3})
        CREATE
      `;
      for (let index = start; index < end; index++) {
        const name = names[index];
        const dni = `${43000000+index}`;
        query=`${query}
        (p${index}:Person{
        personId: ${index},
        name: '${removeAccents(name)}'
        }),
        (d${index}:Dni{
          dniId: randomUuid(),
          number: ${dni}
        }),`;  
      }
      let colorNumber = 0;
      for (let index = start; index < end; index++) {
        colorNumber++;
        query=`${query}
        (p${index})-[:HAS_DNI]->(d${index}),
        (p${index})-[:HAS_COLOR]->(c${colorNumber})
        ${index < end-1 ? ',' : ''}
        `
        if (colorNumber === 3) colorNumber=0;
      }
      await session.executeWrite(
        tx => tx.run(query)
      );
      console.log('DATA CREATED');
      await session.close();
    }
}

module.exports = AmountDataService;