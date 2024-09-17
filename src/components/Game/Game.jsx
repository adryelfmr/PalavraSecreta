import { useState, useEffect, useRef } from "react";
import { wordsList as initialWordsList } from "../../data/words";
import "./Game.css";

const Game = () => {
  const [dicaSorteada, setDicaSorteada] = useState("");
  const [palavraSorteada, setPalavraSorteada] = useState("");
  const [letras, setLetras] = useState([]);
  const [letra, setLetra] = useState("");
  const [letrasAdivinhadas, setLetrasAdivinhadas] = useState([]);
  const [letrasErradas, setLetrasErradas] = useState([]);
  const [progresso, setProgresso] = useState("");
  const [jogoIniciado, setJogoIniciado] = useState(false); // Estado para verificar se o jogo foi iniciado
  const [win, setWin] = useState(false);
  const [lose, setLose] = useState(false);
  const [tentativas, setTentativas] = useState(6);
  const [pontuacao, setPontuacao] = useState(0);
  const [wordsList, setWordsList] = useState(initialWordsList);
  const [validacao, setValidacao] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (jogoIniciado) {
      const novoProgresso = palavraSorteada
        .split("")
        .map((char) => (letrasAdivinhadas.includes(char) ? char : "_"))
        .join("");
      setProgresso(novoProgresso);
    }
  }, [letrasAdivinhadas, palavraSorteada, jogoIniciado]);

  useEffect(() => {
    if (jogoIniciado && progresso === palavraSorteada) {
      console.log("Você ganhou!");
      setWin(true);
      setPontuacao(pontuacao + 10);
    }
  }, [progresso, palavraSorteada, jogoIniciado]);

  useEffect(() => {
    if (jogoIniciado) {
      setTentativas(tentativas - 1);
    }
  }, [letrasErradas]);

  useEffect(() => {
    if (jogoIniciado && tentativas <= 0) {
      setLose(true);
    }
  }, [lose, tentativas]);

  function handleClick() {
    const dicas = Object.keys(wordsList);
    const maxDica = dicas.length;
    const indiceDica = Math.floor(Math.random() * maxDica);
    const dicaAtual = dicas[indiceDica];
    setDicaSorteada(dicaAtual);
    const palavras = wordsList[dicaAtual];
    const maxPalavra = palavras.length;
    const indicePalavra = Math.floor(Math.random() * maxPalavra);
    const palavraAtual = palavras[indicePalavra].toUpperCase();
    setPalavraSorteada(palavraAtual);

    const letras = palavraAtual.split("");
    setLetras(letras);
    setLetrasAdivinhadas([]);

    setProgresso("_".repeat(palavraAtual.length));
    setJogoIniciado(true); // Define que o jogo foi iniciado
    console.log(palavraAtual);
    setLetrasErradas([]);
    setWin(false);
    setLose(false);
    setTentativas(6);

    const palavrasAtualizadas = palavras.filter(
      (_, index) => index !== indicePalavra
    );
    setWordsList((prevWordsList) => ({
      ...prevWordsList,
      [dicaAtual]: palavrasAtualizadas,
    }));

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  const criarDivs = (letras) => {
    return letras.map((letra, index) => (
      <div key={index} className="letras-container_div">
        {" "}
        {letrasAdivinhadas.includes(letra) ? letra : "_"}
      </div>
    ));
  };

  const enviarLetra = (e) => {
    e.preventDefault();
    if (win) {
      handleClick();
      return;
    }
    if (!/^[\p{L}]$/u.test(letra)) {
      setValidacao(true);
      return console.log("Digite apenas letras");
    }
    setValidacao(false);
    if (letra.length > 0 && tentativas > 0) {
      if (palavraSorteada.includes(letra)) {
        if (!letrasAdivinhadas.includes(letra)) {
          setLetrasAdivinhadas([...letrasAdivinhadas, letra]);
          console.log(tentativas);
        }
      } else if (!letrasErradas.includes(letra)) {
        setLetrasErradas([...letrasErradas, letra]);
      }
    }
    setLetra(""); // Limpa o input após o envio
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <>
      <div className="container">
        <h1 className="title">Adivinhe a palavra</h1>

        <button className="btn-sortear" onClick={handleClick}>
          Sortear a palavra
        </button>
        <p className="dica">Dica sobre a palavra: {dicaSorteada}</p>
        <div className="letras-container">{criarDivs(letras)}</div>

        <form className="form-letra" onSubmit={enviarLetra}>
          <p>Digite uma letra</p>
          <input
            className="input-letra"
            type="text"
            maxLength="1"
            value={letra}
            onChange={(e) => setLetra(e.target.value.toUpperCase())}
            ref={inputRef}
          />
          <button className="btn-confirmar" type="submit">
            Confirmar
          </button>
        </form>

        <div className="status-message-validacao">
          {validacao
            ? `Digite apenas letras, incluindo letras com Acentos`
            : ""}
        </div>

        <div className="letras-erradas">
          {jogoIniciado ? `Letras erradas: ${letrasErradas.join(",")}` : ""}
        </div>
        {/* <div className="progresso">{progresso}</div> */}
        <div className="tentativas">
          {" "}
          {jogoIniciado ? `Tentativas restantes ${tentativas}` : ""}
        </div>
        <div className={`status-message ${win ? "win-message" : ""}`}>
          {win ? "Você ganhou" : ""}
        </div>
        <div className={`status-message ${lose ? "lose-message" : ""}`}>
          {lose ? "Você perdeu" : ""}
        </div>
        <div className="pontuacao">Sua pontuação: {pontuacao}</div>
      </div>
    </>
  );
};

export default Game;
