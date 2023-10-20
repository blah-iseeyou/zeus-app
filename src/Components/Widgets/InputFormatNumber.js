import React, { useState } from 'react';
import { Input } from 'native-base';



export default  function InputFormatNumber (props) {

    let { formatter, parser, onChangeText, value, ...others } = props

    let [currentValue, setCurrentValue ] = useState(value)
    let [format, setFormatValue ] = useState(formatter(currentValue ?? 0))

    if (value && value !== null && currentValue != value) {
        setFormatValue(formatter(value))
        setCurrentValue(value)
    }

    const onChangeTextFP = text => {
        let valueParser = parser(text)

        if (!isNaN(parseFloat(valueParser))) {
            valueParser = parseFloat(valueParser)
        } else valueParser = 0.0

        let valueFormat = formatter(valueParser ?? 0)
        setFormatValue(valueFormat)
        onChangeText(valueParser)
        setCurrentValue(valueFormat)
    }

    return <Input {...others}  onChangeText={onChangeTextFP}  value={format} />
}