import sys


ROTORS = {
    "I": "EKMFLGDQVZNTOWYHXUSPAIBRCJ",
    "II": "AJDKSIRUXBLHWTMCQGZNPYFVOE",
    "III": "BDFHJLCPRTXVZNYEIWGAKMUSQO",
  
}

REFLECTORS = {
    "B": "YRUHQSLDPXNGOKMIEBFZCWVJAT",
    "C": "FVPJIAOYEDRZXWGCTKUQSBNMHL",
    
}


def apply_plugboard(message, plugboard):
    plugboard_mapping = {}
    for key, value in plugboard.items():
        plugboard_mapping[key] = value
        plugboard_mapping[value] = key
    return ''.join([plugboard_mapping.get(char, char) for char in message])


def rotate(rotor, offset):
    return rotor[offset:] + rotor[:offset]


def pass_through_rotor(char, rotor, reverse=False):
    index = ord(char) - ord('A')
    if reverse:
        index = rotor.index(char)
        return chr(index + ord('A'))
    return rotor[index]


def reflect(char, reflector):
    index = ord(char) - ord('A')
    return reflector[index]


def replace_numerals(message):
    numeral_map = {
        '1': 'ONE',
        '2': 'TWO',
        '3': 'THREE',
        '4': 'FOUR',
        '5': 'FIVE',
        '6': 'SIX',
        '7': 'SEVEN',
        '8': 'EIGHT',
        '9': 'NINE',
        '0': 'ZERO'
    }
    return ''.join([numeral_map.get(char, char) for char in message])


def encode_message(message, rotors, positions, rings, reflector, plugboard):
   
    message = replace_numerals(message.replace(" ", "").upper())

  
    message = apply_plugboard(message, plugboard)

    result = []
    for char in message:
       
        positions[0] = (positions[0] + 1) % 26
        rotors[0] = rotate(rotors[0], 1)

      
        for i in range(len(rotors)):
            char = pass_through_rotor(char, rotors[i])

   
        char = reflect(char, reflector)


        for i in range(len(rotors) - 1, -1, -1):
            char = pass_through_rotor(char, rotors[i], reverse=True)


        char = apply_plugboard(char, plugboard)

        result.append(char)

    return ''.join(result)


def decode_message(message, rotors, positions, rings, reflector, plugboard):

    return encode_message(message, rotors, positions, rings, reflector, plugboard)

if __name__ == "__main__":
    if len(sys.argv) < 6:
        print("Usage: python3 enigma.py <mode> <message> <rotor1> <rotor2> <rotor3>")
        sys.exit(1)

    mode = sys.argv[1]
    message = sys.argv[2].upper()
    rotors = [ROTORS[sys.argv[i]] for i in range(3, 6)]
    positions = [int(sys.argv[i]) for i in range(6, 9)]
    rings = [int(sys.argv[i]) for i in range(9, 12)]
    reflector = REFLECTORS[sys.argv[12]]
    plugboard = eval(sys.argv[13]) if len(sys.argv) > 13 else {}

    if mode == 'encode':
        result = encode_message(message, rotors, positions, rings, reflector, plugboard)
    elif mode == 'decode':
        result = decode_message(message, rotors, positions, rings, reflector, plugboard)
    else:
        print("Invalid mode. Use 'encode' or 'decode'.")
        sys.exit(1)

    print(result)
