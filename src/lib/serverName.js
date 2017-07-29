const serverName = (context, trevor) => {
  console.log('SERVER NAME FUNCTION CALL', context.command);
  if (trevor.hooks[context.command].subdomain) {
    console.log('SERVER NAME IF', trevor.hooks[context.command].subdomain);

    if (trevor.hooks[context.command].subdomain === '$sha') {
      return context.sha + '.' + trevor.hooks[context.command].domain
    }
    else {
      return trevor.hooks[context.command].subdomain + '.' + trevor.hooks[context.command].domain
    }
  }
  else {
    console.log('SERVER NAME ELSE : ', trevor.hooks[context.command].domain);
    return trevor.hooks[context.command].domain
  }
}

export default serverName;
